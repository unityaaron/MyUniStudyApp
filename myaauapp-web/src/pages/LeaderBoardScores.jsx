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

        <li>
          <Link style={{ backgroundColor: '#7BCCAD',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block' }} to='/gst102_leaderboard'>GST 102</Link>
        </li>


        <li>
          <Link style={{ backgroundColor: '#7BCCAD',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block' }} to='/gst201_leaderboard'>GST 201</Link>
        </li>


        <li>
          <Link style={{ backgroundColor: '#7BCCAD',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block' }} to='/bio101_leaderboard'>BIO 101</Link>
        </li>


        <li>
          <Link style={{ backgroundColor: '#7BCCAD',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block' }} to='/chm101_leaderboard'>CHM 101</Link>
        </li>

        <li>
          <Link style={{ backgroundColor: '#7BCCAD',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'inline-block' }} to='/phy101_leaderboard'>PHY 101</Link>
        </li>


      </ol>
    
    
    
    </div>
  
  

  )
};

export default LeaderBoardScores;
