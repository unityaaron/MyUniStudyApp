import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login to AAU GST App</h2>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;
