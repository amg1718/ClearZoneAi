import React from 'react'
import AppLayout from './Layouts/AppLayout'

const Hero = () => {
  return (
   
    <div
  className="hero min-h-screen " id="hero"
  style={{
    backgroundImage: "url('/BG.png')",
  }}>
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w">
    <h1 className="mb-5 text-8xl font-bold leading-tight">
  <span>Transform workplace</span>
  <br />
  <span>
    safety with <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">AI</span>
  </span>
</h1>

           <div className="flex justify-center mb-5">
      <p className="mb-5 max-w-4xl  text-center ">
      ClearZoneAI leverages computer vision technology to transform workplace safety. Its AI-powered solutions detect hazards, ensure compliance, and provide real-time alerts to prevent accidents. By enabling proactive safety measures, ClearZoneAI helps organizations maintain secure and efficient work environments across various industries.
      </p>
      </div>
      <div className='flex justify-center md:flex-row flex-col gap-12'>
      <button className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none px-8 text-neutral-content text-base transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-blue-500 hover:scale-105">
  Get Started
</button>
<button className="btn bg-white text-base text-black border-none px-6 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-neutral-content hover:scale-105">
  Watch Demo
</button>


      </div>
    </div>
  </div>
</div>
 
  )
}

export default Hero
