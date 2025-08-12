import cv2
import base64
from flask_cors import CORS
from inference import InferencePipeline
from flask import Flask, request, jsonify, send_file,Response
from inference_sdk import InferenceHTTPClient
# from io import BytesIO
import io
from dotenv import load_dotenv
from PIL import Image
from flask_mail import Mail, Message
from datetime import datetime, timedelta

 
last_email_sent_time = None

import threading
import os
load_dotenv()
app = Flask(__name__)
CORS(app)   

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
 
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
 

app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465  # Port for SSL
app.config['MAIL_USE_TLS'] = False   
app.config['MAIL_USE_SSL'] = True  # Enable SSL

mail = Mail(app)
 
latest_processed_frame = None
pipeline = None
pipeline_thread = None
video_url=None
selected_factory=None
FACTORY_VIDEO_URLS = {
    "Factory 1": "http://192.168.1.9:4747/video",
  
    "Factory 2": "http://192.168.1.8:4747/video",
    "Factory 3": "http://192.168.1.6:4747/video",
    "Factory 4": "http://192.168.1.11:4747/video",
}


def image_to_base64(image):
    img = Image.fromarray(image)   
    img_byte_array = io.BytesIO()
    img.save(img_byte_array, format='PNG')  
    img_byte_array = img_byte_array.getvalue()
    return base64.b64encode(img_byte_array).decode('utf-8')

def send_message_async(message):
    threading.Thread(target=send_message, args=(message,)).start()
 
def send_message(message):
    
        try:
            with app.app_context():
                recipient="shreevarshapoojary@gmail.com"
                subject="PPE Alerts"
                body=message
                msg = Message(subject=subject, recipients=[recipient], body=body)
                if 'latest_processed_frame' in globals():
               
                    frame_base64 = image_to_base64(latest_processed_frame)
                
                    img_attachment = base64.b64decode(frame_base64)
               
                    msg.attach("processed_frame.png", "image/png", img_attachment)  # Attach image

              
                
                print("Mail sent successfully")


                 
                mail.send(msg)

                print("Mail sent successfully")
        except Exception as e:

            print("Error sending mail: ", e)
            



 

def my_sink(result, video_frame):
    global latest_processed_frame
    global last_email_sent_time
    print("result: ", result)
   
    if result.get("color_visualization"):
         
        visualization_frame = result["color_visualization"].numpy_image
        latest_processed_frame = visualization_frame   
        print("Color visualization in result.")        
    else:
        print("No color visualization in result.")

    class_names = result['model_predictions'].data['class_name']
    alert_messages = [name for name in class_names if name.startswith("no")]
    if alert_messages:
        alert_text = ", ".join(alert_messages)
        message = f"Alert: {alert_text} detected in area {selected_factory}"
        
        current_time = datetime.now()
        if last_email_sent_time is None or current_time - last_email_sent_time >= timedelta(minutes=1):
            last_email_sent_time = current_time
            send_message_async(f"Alert: {message}")
        else:
            print("Email not sent: Waiting for cooldown period.")
    else:
        print("No alert triggered.")

   
 
def start_pipeline():
    global pipeline
    print("Initializing pipeline...")
    pipeline = InferencePipeline.init_with_workflow(
        api_key="UwIcTTLs4kqwj73WJ9xm",
        workspace_name="ppe1-ppe2",
        workflow_id="ppe",
        video_reference=video_url,   
        max_fps=30,  
        on_prediction=my_sink   
    )

    print("Pipeline initialized.")
    pipeline.start()    
    pipeline.join()    


 

@app.route('/stop')
def stop_pipeline():
    global pipeline_thread
    if pipeline_thread is not None and pipeline_thread.is_alive():
        print("Stopping pipeline thread...")
        
        pipeline.terminate()
        print("Pipeline thread stopped.")
    return jsonify({"message": "Pipeline stopped"}), 200
 
def generate_frames():
    global latest_processed_frame,pipeline_thread,pipeline
    if pipeline_thread is None or not pipeline_thread.is_alive():
        print("Starting pipeline thread...")
        pipeline_thread = threading.Thread(target=start_pipeline)
        pipeline_thread.start()
    while True:
        if latest_processed_frame is not None:
             
            _, buffer = cv2.imencode('.jpg', latest_processed_frame)
            frame_bytes = buffer.tobytes()
 
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')
        else:
            print("Waiting for processed frame...")   




@app.route('/selectFactory', methods=['POST'])
def set_video_url():
    global video_url
    global selected_factory
    try:
        # Parse the selected factory from the frontend
        data = request.get_json()
        selected_factory = data.get("selectedFactory")

        # Validate the selected factory
        if not selected_factory or selected_factory not in FACTORY_VIDEO_URLS:
            return jsonify({"error": "Invalid factory selected"}), 400
         


     
       
       
       
        # Return the video URL as a JSON response
        return jsonify({"videoUrl": video_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@app.route('/video')
def video():
     
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')







if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)   


 