import { Navigate } from "react-router-dom";
import React from "react";
const ProtectedRoute = ({ element, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />; // Redirect if the user is not logged in or doesn't have the correct role
  }
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/unauth-page" />; // Redirect if the user is not logged in or doesn't have the correct role
  }

  return element;
};

export default ProtectedRoute;
