# Import the InferencePipeline object
from inference import InferencePipeline
import cv2

def my_sink(result, video_frame):
    print(result)
    if result.get("mask_visualization"): # Display an image from the workflow response
        cv2.imshow("Workflow Image", result["mask_visualization"].numpy_image)
        cv2.waitKey(1)
    print(result) # do something with the predictions of each frame
    

# initialize a pipeline object
pipeline = InferencePipeline.init_with_workflow(
    api_key="Td6WrgQBti8K1Zgg7FF1",
    workspace_name="5th-sem-el-3dm1s",
    # workflow_id="spilldetection",
    workflow_id="custom-workflow",
    video_reference="spill2.mp4", # Path to video, device id (int, usually 0 for built in webcams), or RTSP stream url
    max_fps=30,
    on_prediction=my_sink
)
pipeline.start() #start the pipeline
pipeline.join() #wait for the pipeline thread to finish