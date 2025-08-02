// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaCog, FaPlusCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTimes } from 'react-icons/fa';

// ✅ Modified: Accept handleLogout and isLoggedIn as props
const Sidebar = ({ isOpen, toggleSidebar, handleLogout, isLoggedIn }) => {

  // ✅ New: Helper function to call logout and then close the sidebar
  const handleLogoutClick = () => {
    handleLogout();     // Call the logout function received from props
    toggleSidebar();    // Close the sidebar after logging out
  };

  return (
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="close-btn" onClick={toggleSidebar}> <FaTimes size={24} style={{ cursor: 'pointer' }} /></div>
        <ul className='ul li' style={{ listStyle: 'none', padding: '0 20px',}}>
          <li><Link to="/profile" style={{ 
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',       
                alignItems: 'center',  
                padding: '0 20px',     
                width: '100%',         
                boxSizing: 'border-box' }} onClick={toggleSidebar}><FaUserCircle size={20} style={{ marginRight: '10px' }} /> Profile</Link></li>
          <li><Link to="/settings" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',       
                alignItems: 'center',  
                padding: '0 20px',     
                width: '100%',         
                boxSizing: 'border-box' }} onClick={toggleSidebar}><FaCog size={20} style={{ marginRight: '10px' }} /> Settings</Link></li>
          <li><Link to="/more" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',       
                alignItems: 'center',  
                padding: '0 20px',     
                width: '100%',         
                boxSizing: 'border-box' }} onClick={toggleSidebar}> <FaPlusCircle size={20} style={{ marginRight: '10px' }} /> More</Link></li>

          {/* ✅ New: Conditional rendering for Logout or Login/Register links */}
          {isLoggedIn ? ( // If the user is logged in...
            <li>
              <button
                onClick={handleLogoutClick} // Call the helper function
                style={{
                textDecoration: 'none',
                color: '#333333',
                display: 'flex',       
                alignItems: 'center',  
                padding: '0 20px',     
                width: '100%',         
                boxSizing: 'border-box' 
                }}
              >
                 <FaSignOutAlt size={20} style={{ marginRight: '10px' }} /> Logout
              </button>
            </li>
          ) : ( // If the user is NOT logged in...
            <>
              <li><Link to="/login" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',       
                alignItems: 'center',  
                padding: '0 20px',     
                width: '100%',         
                boxSizing: 'border-box'}} onClick={toggleSidebar}><FaSignInAlt size={20} style={{ marginRight: '10px' }} /> Login</Link></li>
              <li><Link to="/register" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',       
                alignItems: 'center',  
                padding: '0 20px',     
                width: '100%',         
                boxSizing: 'border-box'}} onClick={toggleSidebar}><FaUserPlus size={20} style={{ marginRight: '10px' }} /> Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;