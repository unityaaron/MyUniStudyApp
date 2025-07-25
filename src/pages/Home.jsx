// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="content">
      <div className="title">Practice Questions</div>
      <div className="cards">
        {/* GST 101 Card */}
        <Link to="/gst101" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="icon math-icon"></div>
          <div className="label">GST 101</div>
          <div className="count">100 questions</div>
        </Link>

        {/* GST 102 Card */}
        <Link to="/gst102" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="icon verbal-icon"></div>
          <div className="label">GST 102</div>
          <div className="count">100 questions!</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
