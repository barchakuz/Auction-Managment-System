import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "../../routes/ConditionalRoutes";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Guest from "../Guest/Guest";
import NotFound from "../../components/NotFound";

const Authentication = () => (
  <PublicRoutes>
    <Routes>
      <Route path="/" element={<Guest />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ForgetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </PublicRoutes>
);

export default Authentication;
