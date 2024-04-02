import React from "react";
import { Routes, Route } from "react-router-dom";
import UserList from "./UserList";
import UserOrders from "./UserOrders";
import UserProducts from "./UserProducts";
import ProductDetail from "../../Products/ProductDetail";

const Users = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/orders/:id" element={<UserOrders />} />
      <Route path="/products/:id" element={<UserProducts />} />
      <Route
        path="/products/:userId/:id"
        element={<ProductDetail back={-1} />}
      />
    </Routes>
  );
};

export default Users;
