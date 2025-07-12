import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/social/login/google/',
          {
            access_token: tokenResponse.access_token,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        localStorage.setItem('jwt', response.data.access);
        alert('Login successful!');
        window.location.href = '/';
      } catch (error) {
        console.error('Login failed:', error.response?.data || error);
        alert('Login failed. Check console.');
      }
    },
    onError: error => {
      console.error('Google login error:', error);
      alert('Login error. See console.');
    },
  });

  return (
    <button onClick={() => login()}
	style={{
        backgroundColor: '#4285F4',
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
