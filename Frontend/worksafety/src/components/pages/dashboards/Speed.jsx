import React, { useState, useEffect } from "react";
import AppLayout from "../../Layouts/AppLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 

const Speed = () => {
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();

  

  const handleVideoChange = async (e) => {
    setVideoFile(e.target.files[0]);
    setIsMonitoring(false);
    setUploaded(false);
    await axios.get("http://localhost:5002/stop/speed");
  };

  const handleBack = async () => {
    setUploaded(false);
    await axios.get("http://localhost:5002/stop/speed");
    navigate(-1);
   
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post("http://localhost:5002/upload", formData);
      alert(response.data.message);
        setUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleMonitorClick = async () => {
    
   
    await axios.get("http://localhost:5002/start/speed");
    setIsMonitoring(true);
   
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Speed Detection Dashboard
            </h1>

           

            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Upload  Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm"
              />
              <button
                onClick={handleUpload}
                className="mt-4 w-full py-3 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all"
              >
                Upload Video
              </button>
            </div>

           { uploaded && <button
              onClick={handleMonitorClick}
              
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg 
              ${  isMonitoring
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                } transition-all`}
            >
              {isMonitoring ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full"></span>
                  <span>Monitoring...</span>
                </div>
              ) : (
                "Start Monitoring"
              )}
            </button>
}
            {isMonitoring && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Live Stream</h2>
                <div className="flex justify-center items-center">
                  <div
                    className="relative bg-gray-200 rounded-lg shadow-md w-[643px] h-[482px]"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <iframe
                      src="http://127.0.0.1:5002/play"
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      style={{ border: "none" }}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <button
              onClick={handleBack}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 px-3 py-1 rounded-md"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Speed;
