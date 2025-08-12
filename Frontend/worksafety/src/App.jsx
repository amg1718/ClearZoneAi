import { useState } from 'react'
 
import './App.css'
import './index.css'
 
 
import Home from './components/Home.jsx'
import{ BrowserRouter, Routes} from 'react-router-dom'
import {Route} from 'react-router-dom'
import Product1 from './components/pages/Product1.jsx'
import MJPEGStreamProcessor from './components/pages/MJPEGStreamProcessor.jsx'
import Dashboard from './components/pages/dashboards/PPE.jsx'
import DashboardRouter from './components/pages/DashboardRouter.jsx'
import AboutUs from './components/AboutUs.jsx'
import ContactUs from './components/ContactUs.jsx' 
import Analytics from './components/pages/Analytics.jsx'
 
function App() {
 
  return (
   <>
   <BrowserRouter>
   <Routes>
      <Route path="/" element = {<Home />} />
       <Route path="/prod1" element = {<Product1 />} />
       <Route path="/dashboard/:name" element = {<DashboardRouter />} />
       <Route path='/about' element={<AboutUs/>}/>
       <Route path='/contact' element={<ContactUs/>}/>
       <Route path='/analytics' element={<Analytics/>}/>
        
       </Routes>
      </BrowserRouter>
     
     </>
  ) 
}

export default App
