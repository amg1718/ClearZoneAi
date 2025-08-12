// import React, { useState, useEffect } from "react";
// import AppLayout from "../../Layouts/AppLayout";
// import axios from "axios";
// const Missing = () => {
//   const [employees, setEmployees] = useState([]); // List of employees
   
//   const [missingEmployees, setMissingEmployees] = useState([]); // Employees not detected
//   const [isMonitoring, setIsMonitoring] = useState(false);

//   // Fetch employee data when the component mounts
//   useEffect(() => {
//     if(!isMonitoring)
//       return;
//     const fetchEmployees = async () => {
//       try {
//              const res=await axios.get('http://localhost:5001/missing/get-names');
//              console.log(res);
//         setEmployees(res?.data?.names);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };

//     fetchEmployees();
//   }, [isMonitoring]);

  
//   useEffect(() => {
//     if (!isMonitoring) return;

//    const fetchMissingEmployees = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/missing/missing_people");
//         console.log(response);
//         setMissingEmployees(response.data.missing_people || employees);  
//       } catch (error) {
//         console.error("Error fetching missing employees:", error);
//       }
//     };

  
//     const interval = setInterval(fetchMissingEmployees, 2000);

   
//     return () => clearInterval(interval);
//   }, [isMonitoring]);
 
 

//   const handleMonitorClick =async () => {
         
//     const res=await axios.get('http://localhost:5001/missing/start');
//     console.log(res);
//     setIsMonitoring(true);
   
//   };

//   const handleStopMonitoring = async() => {
//    await axios.get("http://localhost:5001/missing/stop");
//     setIsMonitoring(false);
//   };

//   return (
//     <AppLayout>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//           <div className="p-8">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
//               Real-Time Employee Tracker
//             </h1>

//            { isMonitoring && <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Missing Employees
//               </h2>
//               {missingEmployees.length > 0 ? (
//                 <ul className="space-y-2">
//                   {missingEmployees.map((name, index) => (
//                     <li
//                       key={index}
//                       className="p-3 bg-red-100 text-red-800 font-bold rounded-lg"
//                     >
//                       {name}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-green-600 font-bold">
//                   All employees are present!
//                 </p>
//               )}
//             </div>
// }
//             <button
//               onClick={isMonitoring ? handleStopMonitoring : handleMonitorClick}
//               className={`w-full py-3 px-6 rounded-lg font-bold text-lg 
//               ${isMonitoring
//                   ? "bg-red-500 hover:bg-red-600 text-white"
//                   : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
//                 } transition-all`}
//             >
//               {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//             </button>

//             {isMonitoring && (
//               <div className="mt-10">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Live Stream</h2>
//                 <div className="relative bg-gray-200 rounded-lg shadow-md" style={{ paddingTop: "56.25%" }}>
//                   <iframe
//                     src="http://localhost:5001/missing/video_feed"
//                     className="absolute top-0 left-0 w-full h-full rounded-lg"
//                     style={{ border: "none" }}
//                     allowFullScreen
//                   ></iframe>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default Missing;

  

// import React, { useState, useEffect } from "react"
// import AppLayout from "../../Layouts/AppLayout"
// import axios from "axios"

// const Missing = () => {
//   const [employees, setEmployees] = useState([])
//   const [missingEmployees, setMissingEmployees] = useState([])
//   const [rescuedEmployees, setRescuedEmployees] = useState([])
//   const [isMonitoring, setIsMonitoring] = useState(false)

//   useEffect(() => {
//     if (!isMonitoring) return
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("http://localhost:5001/missing/get-names")
//         setEmployees(res?.data?.names)
//       } catch (error) {
//         console.error("Error fetching employees:", error)
//       }
//     }
//     fetchEmployees()
//   }, [isMonitoring])

//   useEffect(() => {
//     if (!isMonitoring) return
//     const fetchMissingEmployees = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/missing/missing_people")
//         const currentMissing = response.data.missing_people || employees
//         const rescued = missingEmployees.filter((emp) => !currentMissing.includes(emp))
//         if (rescued.length > 0) {
//           setRescuedEmployees((prev) => [...prev, ...rescued])
//         }
//         setMissingEmployees(response.data.missing_people || employees)
//       } catch (error) {
//         console.error("Error fetching missing employees:", error)
//       }
//     }
//     const interval = setInterval(fetchMissingEmployees, 2000)
//     return () => clearInterval(interval)
//   }, [isMonitoring, missingEmployees])

//   const handleMonitorClick = async () => {
//     const res = await axios.get("http://localhost:5001/missing/start")
//     setIsMonitoring(true)
//   }

//   const handleStopMonitoring = async () => {
//     await axios.get("http://localhost:5001/missing/stop")
//     setIsMonitoring(false)
//   }

//   return (
//     <AppLayout>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
//             <div className="p-8">
//               <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 text-center">
//                 Real-Time Employee Tracker
//               </h1>

//               {isMonitoring && (
//                 <>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                     <div className="bg-indigo-50 p-4 rounded-lg">
//                       <p className="text-sm text-indigo-600 font-medium">Total Employees</p>
//                       <p className="text-2xl font-bold text-indigo-700">{employees.length}</p>
//                     </div>
//                     <div className="bg-red-50 p-4 rounded-lg">
//                       <p className="text-sm text-red-600 font-medium">Missing</p>
//                       <p className="text-2xl font-bold text-red-700">{missingEmployees.length}</p>
//                     </div>
//                     <div className="bg-green-50 p-4 rounded-lg">
//                       <p className="text-sm text-green-600 font-medium">Rescued</p>
//                       <p className="text-2xl font-bold text-green-700">{rescuedEmployees.length}</p>
//                     </div>
//                     <div className="bg-blue-50 p-4 rounded-lg">
//                       <p className="text-sm text-blue-600 font-medium">Present</p>
//                       <p className="text-2xl font-bold text-blue-700">{employees.length - missingEmployees.length}</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col lg:flex-row gap-8">
//                     <div className="w-full lg:w-1/3 space-y-4">
//                       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Missing Employees</h2>
//                       {missingEmployees.length > 0 ? (
//                         <ul className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto pr-4">
//                           {missingEmployees.map((name, index) => (
//                             <li
//                               key={index}
//                               className="p-4 bg-red-100 text-red-800 font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:bg-red-200"
//                             >
//                               {name}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-green-600 font-bold text-lg bg-green-100 p-4 rounded-lg shadow-md">
//                           All employees are  Rescued
//                         </p>
//                       )}
//                     </div>

//                     <div className="w-full lg:w-1/3">
//                       <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Stream</h2>
//                       <div
//                         className="relative bg-gray-200 rounded-lg shadow-lg overflow-hidden"
//                         style={{ paddingTop: "75%" }}
//                       >
//                         <iframe
//                           src="http://localhost:5001/missing/video_feed"
//                           className="absolute top-0 left-0 w-full h-full"
//                           style={{ border: "none" }}
//                           allowFullScreen
//                         ></iframe>
//                       </div>
//                     </div>

//                     <div className="w-full lg:w-1/3 space-y-4">
//                       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rescued Employees</h2>
//                       {rescuedEmployees.length > 0 ? (
//                         <ul className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto pr-4">
//                           {rescuedEmployees.map((name, index) => (
//                             <li
//                               key={index}
//                               className="p-4 bg-green-100 text-green-800 font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:bg-green-200"
//                             >
//                               {name}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-gray-600 font-bold text-lg bg-gray-100 p-4 rounded-lg shadow-md">
//                           No employees rescued yet
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className="w-full flex justify-center mt-8">
//                 <button
//                   onClick={isMonitoring ? handleStopMonitoring : handleMonitorClick}
//                   className={`px-6 py-2 rounded-lg font-medium text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
//                     isMonitoring
//                       ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300"
//                       : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-300"
//                   }`}
//                 >
//                   {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   )
// }

// export default Missing


import React, { useState, useEffect } from "react"
import AppLayout from "../../Layouts/AppLayout"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Missing = () => {
  const [employees, setEmployees] = useState([])
  const [missingEmployees, setMissingEmployees] = useState([])
  const [rescuedEmployees, setRescuedEmployees] = useState([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const navigate=useNavigate();
  const handleBack=()=>{
    navigate(-1);
  }
  useEffect(() => {
    if (!isMonitoring) return
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5001/missing/get-names")
        setEmployees(res?.data?.names)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }
    fetchEmployees()
  }, [isMonitoring])

  useEffect(() => {
    if (!isMonitoring) return
    const fetchMissingEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5001/missing/missing_people")
        const currentMissing = response.data.missing_people || employees
        const rescued = missingEmployees.filter((emp) => !currentMissing.includes(emp))
        if (rescued.length > 0) {
          setRescuedEmployees((prev) => [...prev, ...rescued])
        }
        setMissingEmployees(response.data.missing_people || employees)
      } catch (error) {
        console.error("Error fetching missing employees:", error)
      }
    }
    const interval = setInterval(fetchMissingEmployees, 2000)
    return () => clearInterval(interval)
  }, [isMonitoring, missingEmployees])

  const handleMonitorClick = async () => {
    const res = await axios.get("http://localhost:5001/missing/start")
    setIsMonitoring(true)
  }

  const handleStopMonitoring = async () => {
    await axios.get("http://localhost:5001/missing/stop")
    setIsMonitoring(false)
  }

  return (
    <AppLayout>
      <div className=" bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
            <div className="p-8">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 text-center">
                 Rescue DashBoard
              </h1>

              {isMonitoring && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-sm text-indigo-600 font-medium">Total Employees</p>
                      <p className="text-2xl font-bold text-indigo-700">{employees.length}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Missing</p>
                      <p className="text-2xl font-bold text-red-700">{missingEmployees.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Rescued</p>
                      <p className="text-2xl font-bold text-green-700">{rescuedEmployees.length}</p>
                    </div>
                  
                  </div>

                  <div className="flex flex-col xl:flex-row gap-8 h-[550px] mt-8">
                    <div className="w-full xl:w-1/4 space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Missing Employees</h2>
                      {missingEmployees.length > 0 ? (
                        <ul className="space-y-4 h-[600px] overflow-y-auto pr-4">
                          {missingEmployees.map((name, index) => (
                            <li
                              key={index}
                              className="p-4 bg-red-100 text-red-800 font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:bg-red-200"
                            >
                              {name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-green-600 font-bold text-lg bg-green-100 p-4 rounded-lg shadow-md">
                          All employees are Rescued
                        </p>
                      )}
                    </div>

                    <div className="w-full xl:w-2/4 h-[500px]">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Stream</h2>
                      <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden w-[640px] h-[490px]">
                        <iframe
                          src="http://localhost:5001/missing/video_feed"
                          className="w-full h-full"
                          style={{ border: "none" }}
                          allowFullScreen 
                        ></iframe>
                      </div>
                    </div>

                    <div className="w-full xl:w-1/4 space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rescued Employees</h2>
                      {rescuedEmployees.length > 0 ? (
                        <ul className="space-y-4 h-[600px] overflow-y-auto pr-4">
                          {rescuedEmployees.map((name, index) => (
                            <li
                              key={index}
                              className="p-4 bg-green-100 text-green-800 font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:bg-green-200"
                            >
                              {name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 font-bold text-lg bg-gray-100 p-4 rounded-lg shadow-md">
                          No employees rescued yet
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="w-full flex justify-center mt-[-10px]">
                <button
                  onClick={isMonitoring ? handleStopMonitoring : handleMonitorClick}
                  className={`px-6 py-2 rounded-lg font-medium text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                    isMonitoring
                      ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-300"
                  }`}
                >
                  {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
                </button>
              </div>
            </div>
            <div className="p-4">
          <button onClick={handleBack} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 px-3 py-1 rounded-md">Back</button>


        </div>
          </div>
          
        </div>
       
      </div>
    </AppLayout>
  )
}

export default Missing


 