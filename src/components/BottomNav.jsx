// src/components/BottomNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{ textDecoration: 'none', color: 'inherit' }} >
        <span role="img" aria-label="Home">🏠</span>
        Home
      </NavLink>
      <NavLink to="/jobsandscholarships" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{textDecoration: 'none', color:'inherit'}}>
        <span role="img" aria-label="Jobs">🎓</span>
        Jobs & Scholarships
      </NavLink>
      <NavLink to="/leaderboard" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <span role="img" aria-label="Leaderboard">🏆</span>
        Top Scorers
      </NavLink>
      <NavLink to="/buyandsell" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <span role="img" aria-label="Market">🛍️</span>
        Buy & Sell
      </NavLink>
    </nav>
  );
};

export default BottomNav;