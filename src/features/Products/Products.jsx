import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";

const Products = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/:id/:userId" element={<ProductDetail />} />
      <Route path="/:id" element={<ProductDetail />} />
    </Routes>
  );
};

export default Products;
