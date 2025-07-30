// src/components/Header.js
import React from 'react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <span className="menu-icon" onClick={toggleSidebar}>☰</span>
      My UniStudy App
    </header>
  );
};

export default Header;