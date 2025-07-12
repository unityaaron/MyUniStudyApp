// src/pages/Jobs&Scholarships.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const JobsAndScholarships = () => {
  return (
    <div className="content">
      <div className="title">Jobs&Scholarships</div>
      <div className="cards">
        {/* I GST 101 Card format and CSS */}
        <Link to="/jobs" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="icon math-icon"></div>
          <div className="label">Jobs</div>
          <div className="count">Apply for Jobs as a Student HERE!</div>
        </Link>

        {/* I used GST 102 Card format and CSS */}
        <Link to="/scholarships" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="icon verbal-icon"></div>
          <div className="label">Scholarships</div>
          <div className="count">Apply for Student Scholarships HERE!</div>
        </Link>
      </div>
    </div>
  );
};

export default JobsAndScholarships;
