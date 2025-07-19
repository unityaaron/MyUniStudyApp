// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="close-btn" onClick={toggleSidebar}>×</div>
        <ul className='ul li' style={{ listStyle: 'none', padding: '0 20px',}}>
          <li><Link to="/profile" style={{textDecoration:'none', color:'inherit'}} onClick={toggleSidebar}>👤 Profile</Link></li>
          <li><Link to="/settings" style={{textDecoration: 'none', color:'inherit'}} onClick={toggleSidebar}>⚙️ Settings</Link></li>
          <li><Link to="/more" style={{textDecoration:'none', color:'inherit'}} onClick={toggleSidebar}>➕ More</Link></li>

          {/* ✅ New: Conditional rendering for Logout or Login/Register links */}
          {isLoggedIn ? ( // If the user is logged in...
            <li>
              <button
                onClick={handleLogoutClick} // Call the helper function
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0',
                  color: 'inherit',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  width: '100%', // Make button fill the list item width
                  textAlign: 'left' // Align text to the left
                }}
              >
                ➡️ Logout
              </button>
            </li>
          ) : ( // If the user is NOT logged in...
            <>
              <li><Link to="/login" style={{textDecoration:'none', color:'inherit'}} onClick={toggleSidebar}>🔑 Login</Link></li>
              <li><Link to="/register" style={{textDecoration:'none', color:'inherit'}} onClick={toggleSidebar}>📝 Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;