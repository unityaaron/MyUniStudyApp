// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AAUStudyAppLayout from './layouts/AAUStudyAppLayout';
import Home from './pages/Home';

import GST101Page from './pages/gst101';
import GST102Page from './pages/gst102';
import GST201Page from './pages/gst201';
import BIO101Page from './pages/bio101';
import CHM101Page from './pages/chm101';
import PHY101Page from './pages/phy101';

import './App.css';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MorePage from './pages/MorePage'; // Keep MorePage for when layout is visible
import ScholarshipsPage from './pages/ScholarshipsPage';
import JobsPage from './pages/JobsPage';
import JobsAndScholarships from './pages/JobsAndScholarships';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ New: Import ProtectedRoute
import LeaderBoardScores from './pages/LeaderBoardScores';
import GST101_Leaderboard from './pages/gst101_leaderboard';
import GST102_Leaderboard from './pages/gst102_leaderboard';
import GST201_Leaderboard from './pages/gst201_leaderboard';
import BIO101_Leaderboard from './pages/bio101_leaderboard';
import PHY101_Leaderboard from './pages/phy101_leaderboard';
import CHM101_Leaderboard from './pages/chm101_leaderboard';
import MarketPlace from './pages/marketplace';
import SellerPage from './pages/sellerpage';
import BuyandSell from './pages/buyandsell';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
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
                <Route path='buyandsell' element={<BuyandSell />} />
                <Route path="/gst101" element={<GST101Page />} />
                <Route path="/gst201" element={<GST201Page />} />
                <Route path="/gst102" element={<GST102Page />} />
                <Route path="/bio101" element={<BIO101Page />} />
                <Route path="/chm101" element={<CHM101Page />} />
                <Route path="/phy101" element={<PHY101Page />} /> 
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/jobsandscholarships" element={<JobsAndScholarships />} />
                <Route path='/jobs' element={<JobsPage />} />
                <Route path='scholarships' element={<ScholarshipsPage />} />
                <Route path='leaderboard' element={<LeaderBoardScores />} />
                <Route path='gst101_leaderboard' element={<GST101_Leaderboard />} />
                <Route path='gst102_leaderboard' element={<GST102_Leaderboard />} />
                <Route path='gst201_leaderboard' element={<GST201_Leaderboard />} />
                <Route path='bio101_leaderboard' element={<BIO101_Leaderboard />} />
                <Route path='chm101_leaderboard' element={<CHM101_Leaderboard />} />
                <Route path='phy101_leaderboard' element={<PHY101_Leaderboard />} />
                <Route path='marketplace' element={<MarketPlace />} />
                <Route path='sellerpage' element={<SellerPage />} />
            </Route> 
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;