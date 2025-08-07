// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react'; // ✅ New: Import useState and useEffect hooks
import axios from 'axios'; // ✅ New: Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // ✅ New: Import useNavigate for potential redirection

const ProfilePage = () => {
  // ✅ New: State to store user data
  const [userData, setUserData] = useState(null);
  // ✅ New: State to handle loading status
  const [loading, setLoading] = useState(true);
  // ✅ New: State to handle errors
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  // ✅ New: useEffect hook to fetch data when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Start loading
      setError('');     // Clear any previous errors

      try {
        // 1. Get the authentication token from local storage
        const authToken = localStorage.getItem('authToken');

        // 2. Check if a token exists. If not, the user is not logged in.
        if (!authToken) {
          setError('You are not logged in. Please log in to view your profile.');
          setLoading(false);
          // Optionally redirect to login page if no token is found here
          navigate('/login');
          return; // Stop the function here
        }

        // 3. Make a GET request to Django's /auth/user/ endpoint
        const response = await axios.get('http://127.0.0.1:8000/auth/user/', {
          headers: {
            // ✅ CRITICAL: Include the Authorization header with the token
            'Authorization': `Token ${authToken}` // Format: "Token YOUR_ACTUAL_TOKEN_HERE"
          }
        });

        // 4. If the request is successful, set the user data
        setUserData(response.data);
        console.log("User data fetched successfully:", response.data);

      } catch (err) {
        // 5. Handle errors (e.g., token invalid, server error)
        console.error('Failed to fetch user profile:', err);
        if (err.response) {
          // Django responded with an error (e.g., 401 Unauthorized)
          if (err.response.status === 401 || err.response.status === 403) {
            setError('Your session has expired or you are not authorized. Please log in again.');
            localStorage.removeItem('authToken'); // Clear invalid token
            navigate('/login'); // Redirect to login
          } else {
            setError(`Error fetching profile: ${err.response.status} ${err.response.statusText}`);
          }
        } else if (err.request) {
          setError('No response from server. Is the Django backend running?');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false); // End loading, regardless of success or failure
      }
    };

    fetchUserProfile(); // Call the function when the component mounts
  }, [navigate]); // Add navigate to dependency array to avoid lint warnings, though it's stable

  // Display loading, error, or user data
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  }

  // If user data is available, display it
  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <h1>User Profile</h1>
      {userData ? (
        <div>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          {/* You can display other fields returned by Django's /auth/user/ endpoint */}
          {/* For example: {userData.first_name} or {userData.last_name} if present */}
        </div>
      ) : (
        <p>No user data available. Please try logging in again.</p>
      )}
    </div>
  );
};

export default ProfilePage;