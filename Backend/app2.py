from flask import Flask, request, jsonify, send_file
from inference_sdk import InferenceHTTPClient
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
# Initialize the inference client



@app.route('/process-image', methods=['POST'])
def process_image():
    client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="UwIcTTLs4kqwj73WJ9xm"
)

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided.'}), 400

    image_file = request.files['image']

    try:
        # Save the uploaded image temporarily
        temp_image_path = "temp_uploaded_image.jpg"
        image_file.save(temp_image_path)

        # Run the workflow
        result = client.run_workflow(
            workspace_name="ppe1-ppe2",
            workflow_id="ppe",
            images={
                "image": temp_image_path  # Path to the input image
            },
          # Cache workflow definition for 15 minutes
        )
        print(result)
        # Cleanup the temporary image file
        os.remove(temp_image_path)

        # Check if the result contains the `color_visualization` key
        if "color_visualization" not in result[0]:
            return jsonify({'error': "'color_visualization' key not found in the result JSON."}), 500

        base64_string = result[0]["color_visualization"]

        # Fix Base64 string padding if needed
        missing_padding = len(base64_string) % 4
        if missing_padding:
            base64_string += '=' * (4 - missing_padding)

        # Decode the Base64 string
        image_data = base64.b64decode(base64_string)

        # Convert the image data to an image
        processed_image = Image.open(BytesIO(image_data))

        # Save the processed image to a temporary file
        processed_image_path = "processed_image.jpg"
        processed_image.save(processed_image_path)

        # Return the result and processed image
        with open(processed_image_path, "rb") as img_file:
            processed_image_base64 = base64.b64encode(img_file.read()).decode('utf-8')

        # Cleanup the processed image file
        os.remove(processed_image_path)
        print(processed_image_base64)
        return jsonify({
            'result': result,
            'processed_image': processed_image_base64
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


