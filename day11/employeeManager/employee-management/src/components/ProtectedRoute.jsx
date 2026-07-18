import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const sessionStr = localStorage.getItem("userSession");
  
  if (!sessionStr) {
    return <Navigate to="/" replace />;
  }

  try {
    const session = JSON.parse(sessionStr);
    
    if (allowedRole && session.role !== allowedRole) {
      return <Navigate to={session.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"} replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("userSession");
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;
