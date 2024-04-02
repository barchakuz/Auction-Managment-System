import React from 'react'
import { Routes, Route } from "react-router-dom";
import { SellerProfileCard } from '../components/ProductSeller/SellerProfileCard';


const SellerProfile = () => {
  return (
    <Routes>
    <Route path="/:userId" element={<SellerProfileCard />} />
  </Routes>
  )
}

export default SellerProfile

