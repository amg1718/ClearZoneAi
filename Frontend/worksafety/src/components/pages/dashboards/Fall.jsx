import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../../Layouts/AppLayout";
import axios from "axios"; // For sending email via API
import { useNavigate } from "react-router-dom";

const Fall = () => {
  const URL = "http://localhost:5173/my_model/"; // Replace with the path to your Teachable Machine model
  const canvasRef = useRef(null);
  const labelContainerRef = useRef(null);
  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const lastAlertTimeRef = useRef(Date.now()); // Use a ref to track the last alert time
  let isMounted = true;

  const sendAlertEmail = async (imageBase64) => {
    console.log("Sending alert email...");
    try {
      const response = await axios.post("http://localhost:5000/fall-alert", {
        subject: "Fall Alert!",
        body: "A fall has been detected. Please check the attached image.",
        image: imageBase64,
      });
      console.log("Alert email sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending alert email:", error);
    }
  };

  const init = async () => {
    const modelURL = `${URL}model.json`;
    const metadataURL = `${URL}metadata.json`;

    // Load the model and metadata
    const model = await window.tmPose.load(modelURL, metadataURL);
    modelRef.current = model;
    const maxPredictions = model.getTotalClasses();

    // Initialize webcam
    const size = 200;
    const flip = true; // Flip webcam horizontally
    const webcam = new window.tmPose.Webcam(size, size, flip);
    await webcam.setup(); // Request webcam access
    await webcam.play();
    webcamRef.current = webcam;

    // Set up canvas
    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;

    // Create label elements
    const labelContainer = labelContainerRef.current;
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    // Start the loop
    if (isMounted) {
      window.requestAnimationFrame(loop);
    }
  };

  const loop = async () => {
    if (!webcamRef.current || !modelRef.current || !isMounted) return;

    webcamRef.current.update(); // Update webcam frame
    await predict();
    window.requestAnimationFrame(loop);
  };

  const predict = async () => {
    const webcam = webcamRef.current;
    const model = modelRef.current;

    // Estimate pose from webcam
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const predictions = await model.predict(posenetOutput);

    // Update labels
    const labelContainer = labelContainerRef.current;
    let fallDetected = false;
    predictions.forEach((prediction, index) => {
      labelContainer.childNodes[index].innerHTML =
        `${prediction.className}: ${prediction.probability.toFixed(2)}`;

      if (prediction.className === "Fall" && prediction.probability > 0.5) {
        fallDetected = true;
      }
    });

    // If fall detected, capture photo and send alert email
    if (fallDetected) {
      const currentTime = Date.now();
      if (currentTime - lastAlertTimeRef.current >= 30000) { // Check if 30 seconds have passed
        const imageBase64 = capturePhoto();
        sendAlertEmail(imageBase64);
        lastAlertTimeRef.current = currentTime; // Update the last alert time
      }
    }

    // Draw pose on canvas
    drawPose(pose);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL("image/png"); // Get image as Base64
  };

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const webcam = webcamRef.current;

    if (webcam && webcam.canvas) {
      ctx.drawImage(webcam.canvas, 0, 0);

      if (pose) {
        const minPartConfidence = 0.5;
        window.tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        window.tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      }
    }
  };

  const start = () => {
    if (!isMounted) {
      isMounted = true;
      init();
    }
  };
 const navigate=useNavigate();

  const stop = () => {
    isMounted = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (webcamRef.current) {
      webcamRef.current.stop(); // Stop the webcam
    }
  };
  const handleBack=async()=>{
    stop();
   navigate(-1);
  }

  useEffect(() => {
    return () => {
      stop(); // Clean up on component unmount
    };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Fall Alert
            </h1>

            <div className="mb-8">
              <canvas
                ref={canvasRef}
                className="block w-full border border-gray-300 rounded-lg shadow-sm"
                style={{ height: "300px", width: "100%" }}
              ></canvas>
            </div>

            <div
              ref={labelContainerRef}
              className="bg-gray-100 p-4 rounded-lg shadow-md text-gray-700 mb-4"
            >
              {/* Labels will appear here */}
            </div>

            <div className="flex justify-between space-x-4">
              <button
                className="w-full py-3 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all"
                onClick={start}
              >
                Start
              </button>
              <button
                className="w-full py-3 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all"
                onClick={stop}
              >
                Stop
              </button>
            </div>
            <div className="my-8">
          <button onClick={handleBack} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 px-3 py-1 rounded-md">Back</button>


        </div>
          </div>
        </div>
      
      </div>
    </AppLayout>
  );
};

export default Fall;
