// src/layouts/AAUStudyAppLayout.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Outlet, useNavigate } from 'react-router-dom'; // ✅ New: Import useNavigate
import axios from 'axios'; // ✅ New: Import axios for making API requests

const AAUStudyAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // ✅ New: Initialize useNavigate hook

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ New: handleLogout function
  const handleLogout = async () => {
    try {
      // Get the authentication token from local storage
      const authToken = localStorage.getItem('authToken');

      // If a token exists, send a request to the Django logout endpoint
      if (authToken) {
        await axios.post('http://127.0.0.1:8000/auth/logout/', null, {
          headers: {
            'Authorization': `Token ${authToken}` // Send the token in the Authorization header
          }
        });
        console.log('Successfully logged out from Django backend.');
      } else {
        // If no token exists, just log that we are doing client-side logout
        console.log('No active token found in local storage. Performing client-side logout only.');
      }

      // ✅ CRITICAL STEP: Remove the authentication token from local storage
      localStorage.removeItem('authToken');
      console.log('Auth token removed from client-side storage.');

      // Close the sidebar after logout (good user experience)
      setIsSidebarOpen(false);

      // Redirect the user to the login page after successful logout
      navigate('/login');

    } catch (error) {
      // Handle any errors that occur during the logout process
      console.error('Error during logout:', error);
      // Even if the server-side logout fails, always clear the client-side token for security
      localStorage.removeItem('authToken');
      setIsSidebarOpen(false); // Close sidebar even on error
      navigate('/login'); // Redirect to login page

      // Optionally, show an alert to the user
      alert('Logout failed on the server, but you have been logged out from this app. Please log in again if needed.');
    }
  };

  // ✅ New: Determine if the user is currently logged in
  // This will re-evaluate whenever localStorage changes, triggering a re-render
  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      {/* ✅ Modified: Pass handleLogout function and isLoggedIn status to Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      <main style={{ paddingBottom: '60px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
};

export default AAUStudyAppLayout;