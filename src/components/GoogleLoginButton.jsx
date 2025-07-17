// MyAauApp/src/components/GoogleLoginButton.jsx
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google'; // ✅ The main tool from the library
import axios from 'axios'; // ✅ To send data to your Django backend

const GoogleLoginButton = () => {
  // This 'useGoogleLogin' is a special React hook that handles the Google pop-up for you.
  const login = useGoogleLogin({
    // 'onSuccess' is what happens RIGHT AFTER Google tells your browser "Hey, the user logged in successfully!"
    onSuccess: async tokenResponse => {
      try {
        // Here, we take the special 'tokenResponse' (which has Google's token)
        // and send it to your Django backend.
        const response = await axios.post(
          // 🛑🛑🛑 IMPORTANT CHANGE HERE 🛑🛑🛑
          'http://127.0.0.1:8000/auth/google/connect/', // ✅ Use this new URL, // ✅ Use this new URL, // ✅ THIS IS THE CORRECT URL for dj-rest-auth
          {
            access_token: tokenResponse.access_token, // This is the actual token Google gave us
          },
          {
            headers: {
              'Content-Type': 'application/json', // We're telling Django we're sending JSON data
            },
          }
        );

        // If Django says "Login successful!" and sends back a JWT (your access token)
        localStorage.setItem('jwt', response.data.access); // Store that ticket (JWT) in the browser's local storage
        alert('Login successful!'); // Pop up a happy message
        window.location.href = '/'; // Send the user to the homepage
      } catch (error) {
        // If anything goes wrong with sending data to Django or Django says "No!"
        console.error('Login failed:', error.response?.data || error); // Show the error in the browser's console
        alert('Login failed. Check console.'); // Pop up a sad message
      }
    },
    // 'onError' is what happens if Google itself has a problem (e.g., user closes the pop-up)
    onError: error => {
      console.error('Google login error:', error);
      alert('Login error. See console.');
    },
  });

  return (
    // This is the actual button visible on your page
    <button onClick={() => login()} // When someone clicks, it calls the 'login' function we set up above
      style={{
        backgroundColor: '#4285F4', // Blue color for Google
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
      }}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;