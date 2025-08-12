

import React, { useState, useEffect } from "react";
import AppLayout from "../../Layouts/AppLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fire = () => {
  const [selectedFactory, setSelectedFactory] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [factories, setFactories] = useState([]);

const navigate=useNavigate();
  useEffect(() => {
    const fetchFactories = async () => {
      const mockFactories = ["Factory 1", "Factory 2", "Factory 3", "Factory 4"];
      setFactories(mockFactories);
    };

    fetchFactories();

     

  }, []);

  const handleFactoryChange = async (e) => {

    setSelectedFactory(e.target.value);
    setIsMonitoring(false);
    const res = await axios.get('http://localhost:5000/stop/fire');
   

   

  };
  const handleBack=async()=>{
    navigate(-1);
    const res = await axios.get('http://localhost:5000/stop/fire');
   
    
  }

  const handleMonitorClick = async () => {
    const response = await axios.post("http://localhost:5000/selectFactory",
      {

        selectedFactory: selectedFactory,
      });

    setIsMonitoring(true);
    axios.get('http://localhost:5000/video/fire');


  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Fire Alerts
            </h1>

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
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg 
              ${!selectedFactory || isMonitoring
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
              <div className="mt-10 ">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Live Stream</h2>
                <div className="flex justify-center items-center">
                <div className="relative bg-gray-200 rounded-lg shadow-md w-[643px] h-[482px]" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src="http://localhost:5000/video/fire"
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
          <button onClick={handleBack} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 px-3 py-1 rounded-md">Back</button>


        </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default fire;



 