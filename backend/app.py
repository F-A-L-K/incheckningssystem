
import base64
import io
import os
import uuid
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import face_recognition
import cv2
import json
import numpy as np

FACE_DATA_PATH = "face_data.json"

app = Flask(__name__)
CORS(app)

def load_face_database_from_disk():
    try:
        with open(FACE_DATA_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_face_database_to_disk(face_db):
    with open(FACE_DATA_PATH, "w") as f:
        json.dump(face_db, f)

@app.route('/api/scan-face', methods=['POST'])
def scan_face():
    data = request.get_json()
    image_data = data.get('image', '')
    visitor_info = data.get('visitorInfo', {})

    if image_data.startswith('data:image'):
        image_data = image_data.split(',')[1]

    try:
        # Avkoda och spara bilden
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        os.makedirs('./images', exist_ok=True)

        name = visitor_info.get("name", "unknown").replace(" ", "_")
        company = visitor_info.get("company", "unknown").replace(" ", "_")
        filename = f"{name}-{company}.png"
        file_path = os.path.join('./images', filename)
        image.save(file_path)

        # Gör face encoding
        np_image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        encodings = face_recognition.face_encodings(np_image)

        if not encodings:
            return jsonify({"status": "error", "message": "No face detected in uploaded image"}), 400

        face_encoding = encodings[0].tolist()  # Gör JSON-kompatibel

        # Ladda tidigare data
        face_db = load_face_database_from_disk()

        # Spara ny post
        face_id = str(uuid.uuid4())
        face_db[face_id] = {
            "filename": filename,
            "file_path": file_path,
            "face_encoding": face_encoding,
            "visitor_info": visitor_info
        }

        # Uppdatera JSON-fil
        save_face_database_to_disk(face_db)

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
        image_bytes = base64.b64decode(image_data)
        unknown_image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        unknown_encodings = face_recognition.face_encodings(unknown_image)

        if not unknown_encodings:
            return jsonify({
                "status": "error",
                "recognized": False,
                "message": "No face detected in input image"
            }), 400

        unknown_encoding = unknown_encodings[0]

        # Ladda sparad databas
        face_db = load_face_database_from_disk()

        for face_id, data_entry in face_db.items():
            known_encoding = np.array(data_entry["face_encoding"])
            match = face_recognition.compare_faces([known_encoding], unknown_encoding, tolerance=0.45)

            if match[0]:
                return jsonify({
                    "status": "success",
                    "recognized": True,
                    "visitor_info": data_entry["visitor_info"],
                    "face_id": face_id
                })

        return jsonify({
            "status": "success",
            "recognized": False,
            "message": "No matching face found"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
