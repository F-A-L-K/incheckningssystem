
import base64
import io
import os
import uuid
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# In-memory storage for face data (in production, use a proper database)
face_database = {}

@app.route('/api/scan-face', methods=['POST'])
def scan_face():
    data = request.get_json()
    image_data = data.get('image', '')
    visitor_info = data.get('visitorInfo', {})

    if image_data.startswith('data:image'):
        # Remove the base64 header
        image_data = image_data.split(',')[1]

    try:
        # Decode base64 and open image with PIL
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        # Ensure the ./images directory exists
        os.makedirs('./images', exist_ok=True)

        # Generate a random filename
        filename = f"{uuid.uuid4().hex}.png"
        file_path = os.path.join('./images', filename)

        # Save the image
        image.save(file_path)

        # Store face data with visitor information
        face_id = str(uuid.uuid4())
        face_database[face_id] = {
            'filename': filename,
            'visitor_info': visitor_info,
            'file_path': file_path
        }

        print("Received and saved image:", file_path)
        print("Visitor info:", visitor_info)
        return jsonify({
            "status": "success", 
            "message": "Face and visitor info saved.", 
            "face_id": face_id,
            "filename": filename
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/recognize-face', methods=['POST'])
def recognize_face():
    data = request.get_json()
    image_data = data.get('image', '')

    if image_data.startswith('data:image'):
        image_data = image_data.split(',')[1]

    try:
        # In a real implementation, you would use face recognition algorithms
        # For demo purposes, we'll simulate recognition by checking if we have any stored faces
        if face_database:
            # Return the first stored face data as a match (for demo)
            face_id = list(face_database.keys())[0]
            stored_data = face_database[face_id]
            
            return jsonify({
                "status": "success",
                "recognized": True,
                "visitor_info": stored_data['visitor_info'],
                "face_id": face_id
            })
        else:
            return jsonify({
                "status": "success",
                "recognized": False,
                "message": "No matching face found"
            })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
