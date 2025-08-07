// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserTag, FaHandshake } from "react-icons/fa";

const BuyandSell = () => {
  return (
    <div className="content">
      <div className="title">Buy And Sell</div>
      <div className="cards">
        {/* MarketPlace Card */}
        <Link to="/marketplace" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
         <div><FaHandshake size={40} /></div>
          <div className="label">Market Place</div>
          <div className="count">See What People Are Selling</div>
        </Link>

        {/* SellerPage Card */}
        <Link to="/sellerpage" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div><FaUserTag size={40} /></div>
          <div className="label">Seller</div>
          <div className="count">Post What You Have To Sell</div>
        </Link>
      </div>
    </div>
  );
};

export default BuyandSell;
