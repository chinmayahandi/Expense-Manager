import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  // Show premium loading spinner while resolving backend profile
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader type="spinner" />
      </div>
    );
  }

  // Redirect to login if user session is not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Render subroutes if session is valid
  return <Outlet />;
};

export default ProtectedRoute;
