// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="content">
      <div className="title">Practice Questions</div>
      <div className="cards">
        {/* GST 101 Card */}
        <Link to="/gst101" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaBook size={40} /></div>
          <div className="label">GST 101</div>
          <div className="count">100 questions</div>
        </Link>

        {/* GST 102 Card */}
        <Link to="/gst102" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaBook size={40} /></div>
          <div className="label">GST 102</div>
          <div className="count">100 questions!</div>
        </Link>

        <Link to="/gst201" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaBook size={40} /></div>
          <div className="label">GST 201</div>
          <div className="count">100 questions!</div>
        </Link>

        <Link to="/bio101" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaBook size={40} /></div>
          <div className="label">BIO 101</div>
          <div className="count">100 questions!</div>
        </Link>

        <Link to="/phy101" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaBook size={40} /></div>
          <div className="label">PHY 101</div>
          <div className="count">100 questions!</div>
        </Link>

        <Link to="/chm101" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaBook size={40} /></div>
          <div className="label">CHM 101</div>
          <div className="count">100 questions!</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
