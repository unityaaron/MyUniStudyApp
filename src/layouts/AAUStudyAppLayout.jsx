// src/layouts/AAUStudyAppLayout.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { Outlet } from 'react-router-dom';

const AAUStudyAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main style={{ paddingBottom: '60px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
};

export default AAUStudyAppLayout;
