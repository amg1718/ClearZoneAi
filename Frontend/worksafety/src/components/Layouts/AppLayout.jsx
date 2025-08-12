import React from 'react'
import Navbar from '../Navbar.jsx'
import Footer from '../Footer.jsx'

const AppLayout = ({children}) => {
  return (
    <div className='min-h-[90vh]'>
        <Navbar/>
        {children}
        <Footer/>
    </div>
  )
}

export default AppLayout
