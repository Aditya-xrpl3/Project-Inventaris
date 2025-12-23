import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/api"; // Helper that usually handles interceptors

export function ProtectedRoute({ children }) {
  // Simple check: do we have a token?
  // Ideally, verify token validity with backend or check expiration
  const token = localStorage.getItem("token"); 

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
