

// // import React, { useState, useEffect } from "react";
// // import AppLayout from "../../Layouts/AppLayout";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // const Spill= () => {
// //   const [selectedFactory, setSelectedFactory] = useState("");
// //   const [isMonitoring, setIsMonitoring] = useState(false);
// //   const [factories, setFactories] = useState([]);
// //   const navigate=useNavigate();
// //   useEffect(() => {
// //     const fetchFactories = async () => {
// //       const mockFactories = ["Factory 1", "Factory 2","Factory 3","Factory 4"];
// //       setFactories(mockFactories);
// //     };

// //     fetchFactories();
     


    
// //   }, []);
  

// //   const handleBack=async()=>{
// //     const res = await axios.get('http://localhost:5000/stop/spill');
// //     alert(res?.data.message)
// //     navigate("/");
// //   }

// //   const handleFactoryChange = async(e) => {

    
// //     setSelectedFactory(e.target.value);
// //     setIsMonitoring(false);
// //     const res = await axios.get('http://localhost:5000/stop/spill');
   
    

// //   };

// //   const handleMonitorClick = async () => {
// //     if (!selectedFactory) return;
  
// //     const response = await axios.post("http://localhost:5000/selectFactory",
// //       {

// //         selectedFactory: selectedFactory,
// //       });

// //     setIsMonitoring(true);
// //     axios.get('http://localhost:5000/video/spill');

// //   };

// // //   return (
//     <AppLayout>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//           <div className="p-8">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
//            Spill Alert
//             </h1>

            {/* <div className="mb-8">
              <label
                htmlFor="factory-select"
                className="block text-lg font-medium text-gray-700 mb-3"
              >
                Select a Factory
              </label>
              <select
                id="factory-select"
                value={selectedFactory}
                onChange={handleFactoryChange}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Choose a factory</option>
                {factories.map((factory) => (
                  <option key={factory} value={factory}>
                    {factory}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleMonitorClick}
              disabled={!selectedFactory || isMonitoring}
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg 
              ${
                !selectedFactory || isMonitoring
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

            {isMonitoring && (
               <div className="mt-10">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Live Stream</h2>
               <div className="relative bg-gray-200 rounded-lg shadow-md" style={{ paddingTop: "56.25%" }}>
                 <iframe
                   src="http://localhost:5000/video/spill"
                   className="absolute top-0 left-0 w-full h-full rounded-lg"
                   style={{ border: "none" }}
                   allowFullScreen
                 ></iframe>
               </div>
             </div>
             
            )}
          </div>
          <button onClick={handleBack} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600">Back</button>
        </div> */}
      {/* </div>
    </AppLayout>
  );
};

export default Spill; */}






 

import React, { useState, useEffect } from "react";
import AppLayout from "../../Layouts/AppLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Spill = () => {
  const [selectedFactory, setSelectedFactory] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [factories, setFactories] = useState([]);
  const [mode, setMode] = useState("real-time"); // "real-time" or "photo"
  const [selectedPhoto, setSelectedPhoto] = useState(null);
   const [processedImage, setProcessedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFactories = async () => {
      const mockFactories = ["Factory 1", "Factory 2", "Factory 3", "Factory 4"];
      setFactories(mockFactories);
    };

    fetchFactories();
  }, []);

  const handleBack = async () => {
    navigate(-1);
    const res = await axios.get("http://localhost:5000/stop/spill");
    // alert(res?.data.message);
  
  };

  const handleFactoryChange = async (e) => {
    setSelectedFactory(e.target.value);
    setIsMonitoring(false);
    await axios.get("http://localhost:5000/stop/spill");
  };

  const handleMonitorClick = async () => {
    if (!selectedFactory) return;
    setIsMonitoring(true);
    await axios.post("http://localhost:5000/selectFactory", {
      selectedFactory: selectedFactory,
    });

   
    axios.get("http://localhost:5000/video/spill");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPreview(URL.createObjectURL(file));
      setProcessedImage(null);
    }
  };

  const handlePhotoSubmit = async () => {
    if (!selectedPhoto) {
      alert("Please select a photo first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedPhoto);
    

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/spill/processImage", formData);
      console.log(res)
      setProcessedImage(`data:image/jpeg;base64,${res?.data?.processed_image}`);
      setPreview(null);

    } catch (error) {
      console.error(error);
     
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Spill Alert
            </h1>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setMode("real-time")}
                className={`py-2 px-6 rounded-lg font-bold text-lg transition-all ${
                  mode === "real-time"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Real-Time Monitoring
              </button>
              <button
                onClick={() => setMode("photo")}
                className={`py-2 px-6 rounded-lg font-bold text-lg transition-all ${
                  mode === "photo"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Upload Photo
              </button>
            </div>

            {mode === "real-time" && (
  <>
    <div className="mb-8">
      <label
        htmlFor="factory-select"
        className="block text-lg font-medium text-gray-700 mb-3"
      >
        Select a Factory
      </label>
      <select
        id="factory-select"
        value={selectedFactory}
        onChange={handleFactoryChange}
        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      >
        <option value="">Choose a factory</option>
        {factories.map((factory) => (
          <option key={factory} value={factory}>
            {factory}
          </option>
        ))}
      </select>
    </div>

    <button
      onClick={handleMonitorClick}
      disabled={!selectedFactory || isMonitoring}
      className={`w-full py-3 px-6 rounded-lg font-bold text-lg ${
        !selectedFactory || isMonitoring
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

    {isMonitoring && (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Live Stream</h2>
        <div
          className="relative bg-gray-200 rounded-lg shadow-md"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            src="http://localhost:5000/video/spill"
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            style={{ border: "none" }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    )}

    
  </>
)}


            {mode === "photo" && (
              <div>
                <label
                  htmlFor="photo-upload"
                  className="block text-lg font-medium text-gray-700 mb-3"
                >
                  Upload a Photo
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
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
                <button
                  onClick={handlePhotoSubmit}
                  className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-all"
                >
                {loading ?"Processing":"Submit Photo"}  
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 py-2 px-6 rounded-lg mt-4"
          >
            Back
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Spill;
