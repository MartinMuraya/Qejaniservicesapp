// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // your auth token

  if (!token) {
    return <Navigate to="/login" replace />; // redirect to login if not authenticated
  }

  return children;
}
