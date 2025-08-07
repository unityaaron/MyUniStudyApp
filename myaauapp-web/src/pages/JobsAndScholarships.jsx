// src/pages/Jobs&Scholarships.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { FaMoneyCheckDollar } from "react-icons/fa6";


const JobsAndScholarships = () => {
  return (
    <div className="content">
      <div className="title">Jobs&Scholarships</div>
      <div className="cards">
        {/* I GST 101 Card format and CSS */}
        <Link to="/jobs" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaMoneyCheckDollar size={40} /></div>
          <div className="label">Jobs</div>
          <div className="count">Student Jobs HERE!</div>
        </Link>

        {/* I used GST 102 Card format and CSS */}
        <Link to="/scholarships" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaGraduationCap size={40} /></div>
          <div className="label">Scholarships</div>
          <div className="count">Student Scholarships HERE!</div>
        </Link>
      </div>
    </div>
  );
};

export default JobsAndScholarships;
