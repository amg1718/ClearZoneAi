import React, { useState } from 'react';
import axios from 'axios';

const MJPEGStreamProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);

  const handleProcessVideo = async () => {
    setIsProcessing(true);
    setProcessedVideo(null);

    try {
      const res=await axios.post('http://localhost:5000/process-video', {
        video_url: 'http://172.17.9.64:4747/video',  // MJPEG stream URL
      });
      console.log(res)
      
      // After the processing is started, you can point to the /stream endpoint for live streaming
      setProcessedVideo('http://localhost:5000/stream');
    } catch (error) {
      console.log(error)
      console.error('Error processing video:', error);
      alert('Failed to process video.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Live Processed Video Stream</h1>

       
      <img
        src="http://localhost:5000/video"   
        alt="MJPEG Stream"
        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      />

      
      <button
        onClick={handleProcessVideo}
        disabled={isProcessing}
        className={`mt-6 w-full py-3 px-4 rounded-md font-medium text-white ${
          isProcessing ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Process Video'}
      </button>

     
      {processedVideo && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Processed Video Stream</h3>
          <img
            src={processedVideo}
            alt="Processed MJPEG Stream"
            style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          />
        </div>
      )}
    </div>
  );
};

export default MJPEGStreamProcessor;
