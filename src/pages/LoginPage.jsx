import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login to AAU Study App</h2>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;
