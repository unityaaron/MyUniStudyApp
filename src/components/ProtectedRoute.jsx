// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the authToken exists in local storage
  const isAuthenticated = !!localStorage.getItem('authToken');

  // If authenticated, render the nested routes (Outlet)
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;