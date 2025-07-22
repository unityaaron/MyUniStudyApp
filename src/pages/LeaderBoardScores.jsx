// src/pages/LeaderBoard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
const LeaderBoardScores = () => {
  return (
    <div>
      <h1 style={{textAlign:'center'}}>LeaderBoard for Courses</h1>
      <p>Click on Courses to see Higest Scorers</p>
      <ol>
        <li>
          <Link style={{ backgroundColor: '#7BCCAD',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block' }} to='/gst101_leaderboard'>GST 101</Link>
        </li>
      </ol>
    
    
    
    </div>
  
  

  )
};

export default LeaderBoardScores;
