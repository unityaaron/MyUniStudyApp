// src/components/Header.js
import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <FaBars
        size={24} // You can adjust the size to fit your design
        className="menu-icon" // Keep your existing class for styling
        onClick={toggleSidebar}
        style={{ cursor: 'pointer' }} // Add a pointer cursor to show it's clickable
      />
      My UniStudy App
    </header>
  );
};

export default Header;