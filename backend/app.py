import base64
import io
import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/api/scan-face', methods=['POST'])
def scan_face():
    data = request.get_json()
    image_data = data.get('image', '')

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

        print("Received and saved image:", file_path)
        return jsonify({"status": "success", "message": "Image received and saved.", "filename": filename})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
