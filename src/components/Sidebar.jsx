// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="close-btn" onClick={toggleSidebar}>×</div>
        <ul class='ul li' style={{ listStyle: 'none', padding: '0 20px',}}>
          <li><Link to="/profile" style={{textDecoration:'none', color:'inherit'}} onClick={toggleSidebar}>👤 Profile</Link></li>
          <li><Link to="/settings" style={{textDecoration: 'none', color:'inherit'}} onClick={toggleSidebar}>⚙️ Settings</Link></li>
          <li><Link to="/more" style={{textDecoration:'none', color:'inherit'}} onClick={toggleSidebar}>➕ More</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
