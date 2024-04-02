import React from 'react'
import Navbar from '../components/Navigatiom/Navbar'
import MainBanner from '../components/TopSlider/MainBanner'
import ProductSlider from '../components/TopSlider/ProductSlider'
import Products from './Products/Products'
import FooterClone from '../components/Footer/FooterClone'

const Home = () => {
  return (
    <div>
        <Navbar />
        <MainBanner />
        <ProductSlider />
        <Products />
        <FooterClone />
    </div>
  )
}

export default Home
