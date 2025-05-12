from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import subprocess
import json
import os
import shutil

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results/surya'
STATIC_FOLDER = 'static/images'

for folder in [UPLOAD_FOLDER, RESULTS_FOLDER, STATIC_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

@app.route('/process-document', methods=['POST'])
def process_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Save the uploaded file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Save a copy for display
        display_path = os.path.join(STATIC_FOLDER, file.filename)
        shutil.copy2(filepath, display_path)

        # Get filename without extension
        filename_no_ext = os.path.splitext(file.filename)[0]
        
        # Run surya_ocr command
        command = f"surya_ocr {filepath} --langs en"
        subprocess.run(command, shell=True, check=True)

        # Read results
        results_path = os.path.join(RESULTS_FOLDER, filename_no_ext, 'results.json')
        
        if not os.path.exists(results_path):
            raise FileNotFoundError(f"Results file not found at {results_path}")

        with open(results_path, 'r') as f:
            results = json.load(f)

        # Add image path to results
        results['image_path'] = file.filename

        # Clean up upload
        if os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify(results)

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_file(os.path.join(STATIC_FOLDER, filename))

if __name__ == '__main__':
    app.run(debug=True, port=5000)