import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/context";

const PrivateRoutes = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/" />;
};

const PublicRoutes = ({ children }) => {
  const { user } = useAuth();

  return user ? <Navigate to="/app" /> : children;
};

export { PublicRoutes, PrivateRoutes };
