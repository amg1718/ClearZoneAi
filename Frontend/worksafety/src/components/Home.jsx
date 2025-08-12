import React from 'react'
import AppLayout from './Layouts/AppLayout.jsx'
import Hero from './Hero.jsx'
import Products from './Products.jsx'
import Footer from './Footer'

const Home = () => {
  return (
     <AppLayout>
        <Hero/>
        <Products/>
        
     </AppLayout>
  )
}

export default Home
