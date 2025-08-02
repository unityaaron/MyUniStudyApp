// src/pages/MorePage.js
import React from 'react';
import { FaPhone } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";
import { FaUserTie, FaQuestionCircle } from "react-icons/fa";

const MorePage = () => {
  return (
    <div className="content">
      <h2> More Options </h2>
      <p> <FaPhone size={20} /> Contact Support:<br></br> </p> 
      <p><FaUserTie size={20} />Founder's phone number: 08065907350</p>
      <p> <GiBookshelf size={20} /> About the App: <br></br> This App was created by an Alumni of Ambrose Alli University Ekpoma. 
      He studied Agricultural Economics & Extension Service which is not close to the knowledge of a Computer Science Degree 
      and had no prior knowlegde on Software Development. It was just self-motivation, determination, belief and God.
      While still a student there were no test/exam question practice app to prepare for exams or tests which could make students score higher. 
      This was how the idea came about after months of studying on how to become a Software Engineer. 
      </p>

      <p style={{
          display: 'flex',
          alignItems: 'center',  
          width: '100%',
          boxSizing: 'border-box'
          }}>

          <FaQuestionCircle
          size={20}
          style={{verticalAlign: 'middle'}}
          />
          Help & FAQ: None
      </p>    
    </div>
  );
};

export default MorePage;
