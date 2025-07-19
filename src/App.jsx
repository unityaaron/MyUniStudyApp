// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AAUStudyAppLayout from './layouts/AAUStudyAppLayout';
import Home from './pages/Home';
import News from './pages/NewsPage';
import Market from './pages/BuyAndSellPage';
import GST101Page from './pages/gst101';
import GST102Page from './pages/gst102';
import './App.css';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MorePage from './pages/MorePage'; // Keep MorePage for when layout is visible
import ScholarshipsPage from './pages/ScholarshipsPage';
import JobsPage from './pages/JobsPage';
import JobsAndScholarships from './pages/JobsAndScholarships';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // ✅ New: Import ProtectedRoute


const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES (No Layout, always visible) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/more" element={<MorePage />} /> 

        {/* --- PROTECTED ROUTES (Requires Login, uses AAUStudyAppLayout) --- */}
        {/* All routes inside this ProtectedRoute will only render if user is logged in */}
        {/* If not logged in, they will be redirected to /login */}
        <Route element={<ProtectedRoute />}> {/* Use ProtectedRoute here */}
            {/* The layout itself is rendered inside ProtectedRoute */}
            <Route element={<AAUStudyAppLayout />}>
                <Route path="/" element={<Home />} />        
                <Route path="/news" element={<News/>} />
                <Route path="/market" element={<Market />} />
                <Route path="/gst101" element={<GST101Page />} />
                <Route path="/gst102" element={<GST102Page />} /> 
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/jobsandscholarships" element={<JobsAndScholarships />} />
                <Route path='/jobs' element={<JobsPage />} />
                <Route path='scholarships' element={<ScholarshipsPage />} />
            </Route> 
        </Route>
      </Routes>
    </Router>
  );
};

export default App;