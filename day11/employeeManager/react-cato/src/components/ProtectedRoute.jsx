import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const sessionStr = localStorage.getItem("userSession");
  
  if (!sessionStr) {
    // Redirect to login if session does not exist
    return <Navigate to="/" replace />;
  }

  try {
    const session = JSON.parse(sessionStr);
    
    // Check if the user's role is authorized to view this route
    if (allowedRole && session.role !== allowedRole) {
      // Redirect to correct dashboard based on role to prevent page overlaps
      return <Navigate to={session.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"} replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("userSession");
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;
