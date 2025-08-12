import os
import cv2
import base64
import threading
import io
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_mail import Mail, Message
from PIL import Image
from dotenv import load_dotenv
from datetime import datetime, timedelta
from inference import InferencePipeline
from inference_sdk import InferenceHTTPClient
from io import BytesIO
 
from mediapipe import solutions
import mediapipe as mp
import numpy as np
# Load environment variables
load_dotenv()

# Flask application setup
app = Flask(__name__)
CORS(app)

# Flask Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
mail = Mail(app)


 

# Workflow configurations
WORKFLOW_CONFIGS = {
    "ppe": {
        "api_key": "UwIcTTLs4kqwj73WJ9xm",
        "workspace_name": "ppe1-ppe2",
        "workflow_id": "ppe"
    },
    "hand-gesture": {
        "api_key": "BXG0w7fpflnVEn3N5UM4",
        "workspace_name": "mask-ppe1",
        "workflow_id": "hand-gesture"
    },
    "spill":{
        "api_key": "Td6WrgQBti8K1Zgg7FF1",
        "workspace_name": "5th-sem-el-3dm1s",
        "workflow_id": "custom-workflow-2"
    },
    "fire":{
        "api_key": "nJnIe7RCdyGEnQwh44Q1",
        "workspace_name": "rvce-unlog",
        "workflow_id": "fire"
    }

}

# Global variables
# FACTORY_VIDEO_URLS = {
#     "Factory 1": "http://192.168.1.6:4747/video",
#     "Factory 2": "http://192.168.1.11:4747/video",
#     "Factory 3": "http://192.168.1.6:4747/video",
#     "Factory 4": "http://192.168.1.11:4747/video",
# }
FACTORY_VIDEO_URLS = {
    "Factory 1": "http://192.168.11.117:4747/video",
    "Factory 2": "http://192.168.11.166:4747/video",
    "Factory 3": "http://192.168.11.231:4747/video",
    "Factory 4": "http://192.168.1.11:4747/video",
}
latest_processed_frames = {}
video_url = None
selected_factory = None
last_email_sent_time = None

pipelines = {}
pipeline_threads = {}





 

@app.route('/fall-alert', methods=['POST'])
def alert():
    data = request.json
    photo = data.get("image")

    if not photo:
        return jsonify({"error": "No photo provided"}), 400

    # Decode the photo
    photo_data = base64.b64decode(photo.split(",")[1])
    photo_path = "fall_alert_photo.png"

    # Save the photo
    with open(photo_path, "wb") as f:
        f.write(photo_data)

    # Send email
    try:
        msg = Message(
            "Fall Detected Alert",
            recipients=["shreevarshapoojary@gmail.com"],  # Replace with recipient's email
        )
        msg.body = "A fall was detected. Please find the attached photo."
        with open(photo_path, "rb") as f:
            msg.attach("fall_alert_photo.png", "image/png", f.read())
        mail.send(msg)

         
        os.remove(photo_path)

        return jsonify({"message": "Alert email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500







# Utility functions
def image_to_base64(image):
    img = Image.fromarray(image)
    img_byte_array = io.BytesIO()
    img.save(img_byte_array, format='PNG')
    return base64.b64encode(img_byte_array.getvalue()).decode('utf-8')

def send_message_async(message):
    threading.Thread(target=send_message, args=(message,)).start()

def send_message(message):
    global latest_processed_frames
    try:
        with app.app_context():
            recipient = "shreevarshapoojary@gmail.com"
            msg = Message(subject="Workflow Alerts", recipients=[recipient], body=message)
            if latest_processed_frames:
                for workflow_name, frame in latest_processed_frames.items():
                    frame_base64 = image_to_base64(frame)
                    img_attachment = base64.b64decode(frame_base64)
                    msg.attach(f"processed_frame_{workflow_name}.png", "image/png", img_attachment)
            mail.send(msg)
            print("Mail sent successfully")
    except Exception as e:
        print("Error sending mail: ", e)

def default_sink(workflow_name, result, video_frame):
    global latest_processed_frames, last_email_sent_time
    
    if result.get("color_visualization"):
        visualization_frame = result["color_visualization"].numpy_image
        latest_processed_frames[workflow_name] = visualization_frame
    
    print(result['model_predictions'].data)
    # alert_messages = [name for name in result['model_predictions'].data['class_name'] if name.startswith("no")]
    alert_messages = [name for name in result['model_predictions'].data['class_name'] if name.startswith("no") or name == "fire"]

    if alert_messages:
        current_time = datetime.now()
        if last_email_sent_time is None or current_time - last_email_sent_time >= timedelta(minutes=0.1):
            last_email_sent_time = current_time
            send_message_async(f"{workflow_name} Alert: {', '.join(alert_messages)} detected in area {selected_factory}")

def start_pipeline(workflow_name):
    config = WORKFLOW_CONFIGS[workflow_name]
    pipeline = InferencePipeline.init_with_workflow(
        api_key=config["api_key"],
        workspace_name=config["workspace_name"],
        workflow_id=config["workflow_id"],
        video_reference=video_url,
        max_fps=30,
        on_prediction=lambda result, video_frame: default_sink(workflow_name, result, video_frame)
    )
    pipelines[workflow_name] = pipeline
    pipeline.start()
    pipeline.join()

def generate_frames(workflow_name):
    global latest_processed_frames, pipeline_threads, pipelines
    if workflow_name not in pipeline_threads or not pipeline_threads[workflow_name].is_alive():
        print(f"Starting pipeline thread for {workflow_name}...")
        pipeline_threads[workflow_name] = threading.Thread(target=start_pipeline, args=(workflow_name,))
        pipeline_threads[workflow_name].start()
    while True:
        if workflow_name in latest_processed_frames:
            _, buffer = cv2.imencode('.jpg', latest_processed_frames[workflow_name])
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')
        else:
            print(f"Waiting for processed frame from {workflow_name}...")

@app.route('/start/<workflow_name>')
def start_specific_pipeline(workflow_name):
    global pipeline_threads
    print("WORKFLOW NAME",workflow_name)    
    # print(workflow_name)
    if workflow_name not in WORKFLOW_CONFIGS:
        return jsonify({"error": "Invalid workflow name"}), 400
    if workflow_name in pipeline_threads and pipeline_threads[workflow_name].is_alive():
        return jsonify({"error": "Pipeline already running"}), 400
    thread = threading.Thread(target=start_pipeline, args=(workflow_name,))
    pipeline_threads[workflow_name] = thread
    thread.start()
    return jsonify({"message": f"{workflow_name} pipeline started"}), 200

@app.route('/stop/<workflow_name>')
def stop_specific_pipeline(workflow_name):
    print("WORKFLOW NAME",workflow_name)
    global pipelines, pipeline_threads
    if workflow_name in pipelines:
        print("pipelines",pipelines)
         
        pipelines[workflow_name].terminate()
        print("------------------------------------")
        print("terminated")
        print("------------------------------------")
        del pipelines[workflow_name]
    if workflow_name in pipeline_threads:
        print(pipeline_threads)
        pipeline_threads[workflow_name].join()
        # pipeline_threads[workflow_name].terminate()
        del pipeline_threads[workflow_name]
        print("------------------------------------")
        print("terminated")
        print("------------------------------------")
 
    return jsonify({"message": f"{workflow_name} pipeline stopped"}), 200

@app.route('/video/<workflow_name>')
def video_feed(workflow_name):
    print(workflow_name)
    if workflow_name not in WORKFLOW_CONFIGS:
        return jsonify({"error": "Invalid workflow name"}), 400
    return Response(generate_frames(workflow_name), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/selectFactory', methods=['POST'])
def set_video_url():
    global video_url, selected_factory
    try:
        data = request.get_json()
        selected_factory = data.get("selectedFactory")
        print(selected_factory)
        if selected_factory not in FACTORY_VIDEO_URLS:
            return jsonify({"error": "Invalid factory selected"}), 400
        video_url = FACTORY_VIDEO_URLS[selected_factory]
        return jsonify({"videoUrl": video_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500






# Spill Detection

@app.route('/spill/processImage', methods=['POST'])
def process_image():
    client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="Td6WrgQBti8K1Zgg7FF1"
)

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided.'}), 400

    image_file = request.files['image']

    try:
         
        temp_image_path = "temp_uploaded_image.jpg"
        image_file.save(temp_image_path)

        
        result = client.run_workflow(
            workspace_name="5th-sem-el-3dm1s",
            workflow_id="custom-workflow",
            images={
                "image": temp_image_path 
            },
          
        )
         
        predictions = result[0]['model_predictions']['predictions']
       

        os.remove(temp_image_path)

        
        if "color_visualization" not in result[0]:
            return jsonify({'error': "'color_visualization' key not found in the result JSON."}), 500

        base64_string = result[0]["color_visualization"]

      
        missing_padding = len(base64_string) % 4
        if missing_padding:
            base64_string += '=' * (4 - missing_padding)

        
        image_data = base64.b64decode(base64_string)
 
        processed_image = Image.open(BytesIO(image_data))

        
        processed_image_path = "processed_image.jpg"
        processed_image.save(processed_image_path)
    

        
        if len(predictions) > 0:
            try:
                with app.app_context():
                    recipient = "shreevarshapoojary@gmail.com"
                    msg = Message(subject="Spill alert", recipients=[recipient], body="Spill detected in factory")
                    with open(processed_image_path, "rb") as image_file:
                         img_attachment = image_file.read()
                         msg.attach("processed_image.jpg", "image/jpeg", img_attachment)
                         mail.send(msg)
                    print("Mail sent successfully")
            except Exception as e:
                print("Error sending mail: ", e)




       
        with open(processed_image_path, "rb") as img_file:
            processed_image_base64 = base64.b64encode(img_file.read()).decode('utf-8')
 
        os.remove(processed_image_path)
        
        return jsonify({
            'result': result,
            'processed_image': processed_image_base64
        })

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500







streaming = False   


def distance_limbs(limb1, limb2):
    return np.sqrt((limb1.x - limb2.x)**2 + (limb1.y - limb2.y)**2)

def get_limbs(pose_landmarks):
    return {
        "left_hand": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_WRIST],
        "right_hand": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.RIGHT_WRIST],
        "left_elbow": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_ELBOW],
        "right_elbow": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.RIGHT_ELBOW],
        "left_foot": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_ANKLE],
        "right_foot": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.RIGHT_ANKLE],
        "left_shoulder": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_SHOULDER],
        "right_shoulder": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER],
        "left_knee": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_KNEE],
        "right_knee": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.RIGHT_KNEE],
        "left_hip": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_HIP],
        "right_hip": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.RIGHT_HIP],
        "head": pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.NOSE]
    }

def is_climbing(pose_landmarks):
    """
    Detect if the person is climbing based on the movement of hands and feet.
    Assumes climbing involves upward movement of limbs over time.
    """
    limbs = get_limbs(pose_landmarks)
    left_hand = limbs["left_hand"]
    right_hand = limbs["right_hand"]
    left_foot = limbs["left_foot"]
    right_foot = limbs["right_foot"]

    # Define thresholds for vertical movement to classify as climbing
    vertical_threshold = 0.1  # Adjust as necessary

    # Detect if the hands are higher than hips and moving upward
    climbing_hands = (
        left_hand.y < limbs["left_hip"].y - vertical_threshold
        and right_hand.y < limbs["right_hip"].y - vertical_threshold
    )

    # Detect if the feet are moving upward (not descending)
    climbing_left_feet = (
        left_foot.y < limbs["right_knee"].y + 0.1 
    )
    climbing_right_feet = (
        right_foot.y < limbs["left_knee"].y + 0.1
    )

    return climbing_hands and (climbing_left_feet or climbing_right_feet)

# Initialize the pose detector
detector = solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)


def send_message_async_climb(frame):
    threading.Thread(target=send_message_climb, args=(frame,)).start()



def send_message_climb(frame):
    global selected_factory
    try:
        with app.app_context():
            recipient = "shreevarshapoojary@gmail.com"
            message = f"Climbing detected in area {selected_factory}"
            msg = Message(subject="Climbing alert", recipients=[recipient], body=message)
           
            frame_base64 = image_to_base64(frame)
            img_attachment = base64.b64decode(frame_base64)
            msg.attach(f"processed_frame.png", "image/png", img_attachment)
            mail.send(msg)
             
            print("Mail sent successfully")
    except Exception as e:
        print("Error sending mail: ", e)

def generate_frames_climb(video_url):
    global streaming,last_email_sent_time
    cap = cv2.VideoCapture(video_url)

    while cap.isOpened() and streaming:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert the frame to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame for pose estimation
        results = detector.process(frame_rgb)

        # Annotate the frame with pose landmarks
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            for connection in mp.solutions.pose.POSE_CONNECTIONS:
                start = landmarks[connection[0]]
                end = landmarks[connection[1]]

                # Only draw visible landmarks
                if start.visibility > 0.5 and end.visibility > 0.5:
                    start_point = (int(start.x * frame.shape[1]), int(start.y * frame.shape[0]))
                    end_point = (int(end.x * frame.shape[1]), int(end.y * frame.shape[0]))
                    cv2.line(frame, start_point, end_point, (0, 255, 0), 2)

            # Display climbing status
            climbing_status = is_climbing(results.pose_landmarks)
            status_text = "Climbing" if climbing_status else "Not Climbing"

            cv2.putText(
                frame,
                status_text,
                (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0) if climbing_status else (0, 0, 255),
                2,
            )

            # Send email if climbing detected
            if climbing_status:
                 current_time = datetime.now()
                 if last_email_sent_time is None or current_time - last_email_sent_time >= timedelta(minutes=1):
                     send_message_async_climb(frame)
                     last_email_sent_time = current_time
  
        # Encode the frame in JPEG format
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
         
        # Yield the frame to the browser
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()


@app.route('/pose/video')
def video_feed_pose():
    # Route to stream the video feed
    global streaming
    if streaming:
        return Response(generate_frames_climb(video_url), mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        return "Video feed is stopped."
    
    
@app.route('/pose/start')
def start():
    global streaming
    streaming = True
    return jsonify({"status": "success", "message": "Video streaming started."})

@app.route('/pose/stop')
def stop():
    global streaming
    streaming = False
    return jsonify({"status": "success", "message": "Video streaming stopped."})

 
 





@app.route('/pose/selectFactory', methods=['POST'])
def set_video_url_pose():
    global video_url, selected_factory
    try:
        data = request.get_json()
        selected_factory = data.get("selectedFactory")
        print(selected_factory)
        if selected_factory not in FACTORY_VIDEO_URLS:
            return jsonify({"error": "Invalid factory selected"}), 400
        video_url = FACTORY_VIDEO_URLS[selected_factory]
        return jsonify({"videoUrl": video_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

























if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
