// src/components/BottomNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaTrophy, FaShoppingBasket, } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{ textDecoration: 'none', color: 'inherit' }} >
        <FaHome size={22} /> 
        <span style={{ color: 'white' }}>Home</span>
      </NavLink>
      <NavLink to="/jobsandscholarships" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{textDecoration: 'none', color:'inherit'}}>
        <FaUserGraduate size={22} />
        <span style={{ color: 'white' }}>Jobs & Scholarships</span>
      </NavLink>
      <NavLink to="/leaderboard" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <FaTrophy size={22} />
        <span style={{ color: 'white' }}>Top Scorers</span>
      </NavLink>
      <NavLink to="/buyandsell" className = {({isActive}) => isActive ? 'nav-item active':'nav-item'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <FaShoppingBasket size={22} />
        <span style={{ color: 'white' }}>Buy & Sell Items</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;