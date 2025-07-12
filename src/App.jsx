// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AAUStudyAppLayout from './layouts/AAUStudyAppLayout';
import Home from './pages/Home';
import News from './pages/NewsPage';
import Market from './pages/BuyAndSellPage';
import GST101Page from './pages/gst101';
import GST102Page from './pages/gst102'
// src/App.js
import './App.css'; // ✅ This is enough
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MorePage from './pages/MorePage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import JobsPage from './pages/JobsPage';
import JobsAndScholarships from './pages/JobsAndScholarships';
import LoginPage from './pages/LoginPage'; 


const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/login" element={<LoginPage />} />
        <Route element={<AAUStudyAppLayout />}>
          <Route path="/" element={<Home />} />        
          <Route path="/news" element={<News/>} />
          <Route path="/market" element={<Market />} />
          <Route path="/gst101" element={<GST101Page />} />
          <Route path="/gst102" element={<GST102Page />} /> 
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/jobsandscholarships" element={<JobsAndScholarships />} />
          <Route path='/jobs' element={<JobsPage />} />
          <Route path='scholarships' element={<ScholarshipsPage />} />

        </Route> 
      </Routes>
    </Router>
  );
};

export default App;
