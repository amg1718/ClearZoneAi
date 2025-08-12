  

import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
const Product1 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [resultJson, setResultJson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setProcessedImage(null);
      setResultJson(null);
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/process-image', {
        method: 'POST',
        body: formData,
      });
          console.log(response)
       

      const data = await response.json();
      console.log(data);
      setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
      setResultJson(data.result);
    } catch (error) {
      console.log(error)
      alert('Failed to process the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Photo Processor
            </div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
              Upload and process your image
            </h2>
            <p className="mt-2 text-gray-500">
              Select an image to upload and see the processed result.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Choose file
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              />
            </div>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            <button
              onClick={processImage}
              disabled={!selectedFile || isLoading}
              className={`mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md 
              ${
                !selectedFile || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Processing...' : 'Process Image'}
            </button>
            {processedImage && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Processed Image</h3>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            {resultJson && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Result JSON</h3>
                <pre className="mt-2 p-2 bg-gray-100 rounded-lg shadow-md text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(resultJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default Product1;