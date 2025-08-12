  import React from 'react'
  import{ Link, useNavigate} from 'react-router-dom'
  import { useRef } from 'react'
  import { useEffect } from 'react'
  import { useState } from 'react'
  const Navbar = () => {
  

   
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      const handleDocumentClick = (event) => {
        // Close the dropdown if clicking outside
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
  
      document.addEventListener("click", handleDocumentClick);
  
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }, []);
    return (
        <div className="navbar bg-white shadow-lg fixed top-0  z-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              
              <li className="font-bold">
  <Link to="/">Home</Link>
</li>



              <li>
                <a className='font-bold'>Solutions</a>
                <ul className="p-2 w-16">
                  <li className='font-bold '><a>Solution 1</a></li>
                  <li className='font-bold'><a>Solution 2</a></li>
                </ul>
              </li>
              <li className='font-bold'><a>About Us</a></li>
               
            </ul>
          </div>
          <Link to="/#hero"className= "btn btn-ghost text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">ClearZone AI</Link>
           
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
          <li className="font-bold">
  <Link to="/#hero">Home</Link>
</li>
 


<li ref={dropdownRef} className={`dropdown ${isDropdownOpen ? "dropdown-open" : ""}`}>
  {/* <details open={isDropdownOpen}> */}
    {/* <summary class="font-bold"
        onClick={()=>setDropdownOpen(!isDropdownOpen)}
    >Solutions</summary> */}

<div
              tabIndex={0}
              className="font-bold cursor-pointer dropdown-toggle"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              Solutions
            </div>
    {/* <ul class=" dropdown-content p-4 pb-6 grid grid-cols-2 gap-2 w-96 rounded-2xl border bg-white shadow-md">
      <li class="hover:bg-gray-100 hover:border-t hover:border-b border-gray-200 hover:text-blue-600 p-4">
        <img src='/ppe.svg'/>
        <Link to="/#solution1" class="font-bold">PPE Detection</Link>
      </li>
      <li class="hover:bg-gray-100 hover:border-t hover:border-b border-gray-200 hover:text-blue-600 p-4">
        <img src='/evacuation.svg'/>
        <Link to="/#solution2" class="font-bold">Evacuation Management</Link>
      </li>
      <li class="hover:bg-gray-100 hover:border-t hover:border-b border-gray-200 hover:text-blue-600 p-4">
        <img src='/spill.svg'/>
        <Link to="/#solution3" class="font-bold">Spillage Detection</Link>
      </li>
      <li class="hover:bg-gray-100 hover:border-t hover:border-b border-gray-200 hover:text-blue-600 p-4">
        <img src='/fall.svg'/>
        <Link to="/#solution4" class="font-bold">Fall Alerts</Link>
      </li>
      <li class="hover:bg-gray-100 hover:border-t hover:border-b border-gray-200 hover:text-blue-600 p-4">
        <img src='/gesture.svg'/>
        <Link to="/#solution5" class="font-bold">Emergency Communication</Link>
      </li>
      <li class="hover:bg-gray-100 hover:border-t hover:border-b border-gray-200 hover:text-blue-600 p-4">
        <img src='/climb.svg'/>
        <Link to="/#solution6" class="font-bold">Behavioural Safety</Link>
      </li>



    </ul> */}



<ul class="dropdown-content p-4 pb-6 grid grid-cols-2 gap-2 w-96 rounded-2xl border bg-white shadow-md">
  <li class="hover:bg-gray-100 border border-gray-200 hover:text-blue-600 p-4">
    <img src='/ppe.svg' />
    <Link to="/#solution1" class="font-bold">PPE Detection</Link>
  </li>
  <li class="hover:bg-gray-100 border border-gray-200 hover:text-blue-600 p-4">
    <img src='/evacuation.svg' />
    <Link to="/#solution2" class="font-bold">Evacuation Management</Link>
  </li>
  <li class="hover:bg-gray-100 border border-gray-200 hover:text-blue-600 p-4">
    <img src='/spill.svg' />
    <Link to="/#solution3" class="font-bold">Spillage Detection</Link>
  </li>
  <li class="hover:bg-gray-100 border border-gray-200 hover:text-blue-600 p-4">
    <img src='/fall.svg' />
    <Link to="/#solution4" class="font-bold">Fall Alerts</Link>
  </li>
  <li class="hover:bg-gray-100 border border-gray-200 hover:text-blue-600 p-4">
    <img src='/gesture.svg' />
    <Link to="/#solution5" class="font-bold">Emergency Communication</Link>
  </li>
  <li class="hover:bg-gray-100 border border-gray-200 hover:text-blue-600 p-4">
    <img src='/climb.svg' />
    <Link to="/#solution6" class="font-bold">Behavioural Safety</Link>
  </li>
</ul>

  {/* </details> */}
</li>

 


            <li className='font-bold'><Link to='/about'>About Us</Link></li>
            <li className='font-bold'><Link to='/analytics'>Analytics</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn btn-ghost  border-none bg-white">Contact Us</a>
        </div>
      </div>
    )
  }
  
  export default Navbar
  