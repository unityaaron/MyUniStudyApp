// MyAauApp/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // ✅ This gets your Client ID from .env

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}> {/* ✅ This wraps your App */}
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)