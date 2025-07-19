// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // State variables for form inputs
  // ✅ New: Add state for username
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Keep email, still good to have for registration and possibly future login methods
  const [password, setPassword] = useState('');

  // State variables for displaying messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Hook for redirection

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop the browser from reloading

    setError('');    // Clear previous errors
    setSuccess('');  // Clear previous success messages

    try {
      // Prepare the data to send to your Django backend's login endpoint
      // ✅ Modified: Include username in loginData
      const loginData = {
        username: username, // Send the username
        email: email,       // Keep email, Django might use it or ignore it depending on exact config
        password: password,
      };

      // Make a POST request to your Django backend's login endpoint
      const response = await axios.post(
        'http://127.0.0.1:8000/auth/login/', // Your Django API endpoint for login
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle successful login
      console.log('Login successful:', response.data);
      setSuccess('Login successful! Redirecting to home...');

      // CRITICAL STEP: Store the authentication token
      const authToken = response.data.key;
      if (authToken) {
        localStorage.setItem('authToken', authToken); // Save the token in browser's local storage
        console.log('Auth Token stored:', authToken);
      } else {
        console.warn('Authentication token not received in response.');
        setError('Login successful, but no token received. Please try again.');
      }

      // Clear form fields after successful login
      setUsername(''); // ✅ New: Clear username field
      setEmail('');
      setPassword('');

      // Redirect to the home page after a short delay
      setTimeout(() => {
        navigate('/'); // Redirects to the root/home path
      }, 2000); // Wait for 2 seconds

    } catch (err) {
      // Handle errors from Django
      console.error('Login error:', err);

      if (err.response) {
        // Django sent an error response (e.g., 400 Bad Request for invalid credentials)
        console.error('Error response data:', err.response.data);
        let errorMessage = "Login failed. Please check your credentials.";

        // ✅ Modified: Improved error message display from Django's non_field_errors
        if (err.response.data.non_field_errors) {
            errorMessage = `Login Failed: ${err.response.data.non_field_errors.join(', ')}`;
        } else if (err.response.data.detail) {
            errorMessage = `Login Failed: ${err.response.data.detail}`;
        } else if (err.response.data.username) { // Specific username errors
            errorMessage += ` Username: ${err.response.data.username.join(', ')}.`;
        } else if (err.response.data.email) { // Specific email errors
            errorMessage += ` Email: ${err.response.data.email.join(', ')}.`;
        } else if (err.response.data.password) { // Specific password errors
            errorMessage += ` Password: ${err.response.data.password.join(', ')}.`;
        }

        setError(errorMessage);
      } else if (err.request) {
        setError('No response from server. Is the Django backend running?');
        console.error('No response from server:', err.request);
      } else {
        setError('An unexpected error occurred.');
        console.error('Error setting up request:', err.message);
      }
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <h2>Login to your Account or Register as new user</h2>
      

      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* ✅ New: Input field for Username */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Mark as required since Django needs it
          />
        </div>

        {/* Input field for Email (Optional to keep visible, but for allauth login, it's often email/password) */}
        {/* We'll keep it for consistency with registration, even if username is now the primary ID for login endpoint */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Keep as required
          />
        </div>

        {/* Input field for Password */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
      <br></br>
      <button onClick={() => navigate('/register')} style={{textDecoration:'none', color:'inherit'}} >📝 Register</button>
    </div>
  );
}

export default LoginPage;