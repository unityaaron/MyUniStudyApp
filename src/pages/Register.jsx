// src/pages/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ New: Import useNavigate hook

function Register() {
  // State variables for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State variables for displaying messages to the user
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // ✅ New: Get the navigate function from the hook

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    // Frontend validation: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Prepare the data to send to your Django backend
      const registrationData = {
        username: username,
        email: email,
        password1: password,
        password2: confirmPassword,
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/auth/registration/',
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle a successful response from Django
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! Redirecting to login...'); // Update message

      // Clear the form fields after successful registration (optional, as we are redirecting)
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // ✅ New: Redirect the user to the login page after a short delay
      setTimeout(() => {
        navigate('/login'); // Redirects to the /login path
      }, 2000); // Wait for 2 seconds (2000 milliseconds) before redirecting

    } catch (err) {
      // Handle errors that come back from the server
      console.error('Registration error:', err);

      if (err.response) {
        console.error('Error response data:', err.response.data);
        let errorMessage = "Registration failed. Please check your details.";

        if (err.response.data.username) {
          errorMessage += ` Username: ${err.response.data.username.join(', ')}.`;
        }
        if (err.response.data.email) {
          errorMessage += ` Email: ${err.response.data.email.join(', ')}.`;
        }
        if (err.response.data.password) {
          errorMessage += ` Password: ${err.response.data.password.join(', ')}.`;
        }
        if (err.response.data.password2) {
            errorMessage += ` ${err.response.data.password2.join(', ')}`;
        }
        if (err.response.data.non_field_errors) {
            errorMessage += ` ${err.response.data.non_field_errors.join(', ')}`;
        }
        if (err.response.data.detail) {
            errorMessage += ` ${err.response.data.detail}`;
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
      <h1>Register Page</h1>
      <p>Welcome to the registration page!</p>

      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            placeholder="Don't lose your username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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

        <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />
        </div>

        <button type="submit">Register</button>
      </form>


      <br></br>
        <button onClick={() => navigate('/login')} style={{textDecoration:'none', color:'inherit'}} >🔑 Login</button>
              
          
    </div>
  );
}

export default Register;