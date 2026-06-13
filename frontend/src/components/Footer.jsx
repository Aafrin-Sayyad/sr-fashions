
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="SR Fashions" className="footer-logo" />
          <p className="footer-tagline">Your Complete Family Store</p>
          <p className="footer-desc">Serving fashion for every member of your family — from infants to elders. Quality, variety, and style at affordable prices.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Shop All</Link>
          <Link to="/about">About Us</Link>
          <Link to="/visit">Visit Store</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/orders">My Orders</Link>
        </div>
        <div className="footer-categories">
          <h4>Categories</h4>
          <Link to="/products?category=sarees">Sarees</Link>
          <Link to="/products?category=kids-wear">Kids Wear</Link>
          <Link to="/products?category=mens-wear">Mens Wear</Link>
          <Link to="/products?category=womens-wear">Womens Wear</Link>
          <Link to="/products?category=uniforms">School Uniforms</Link>
          <Link to="/products?isPremium=true">Premium Collection</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <a href="tel:7659983786" className="contact-row"><FiPhone size={15}/> 7659983786</a>
          <a href="mailto:srfashions@gmail.com" className="contact-row"><FiMail size={15}/> srfashions@gmail.com</a>
          <div className="contact-row"><FiMapPin size={15}/><span>SR Fashions, near water plant, Tempalli, Gannavaram Mandal, Vijayawada, Krishna Dist, AP - 521286</span></div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="page-container footer-bottom-inner">
          <p>© 2024 SR Fashions. All rights reserved. | Apparel for Kids & The Entire Family</p>
          <p style={{fontSize:'12px', color:'var(--text-light)', marginTop:'4px'}}>Payments powered by Razorpay. Secure & encrypted.</p>
        </div>
      </div>
      <style>{`
        .site-footer { background: var(--navy); color: var(--gold-light); margin-top: 60px; }
        .footer-inner {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px; padding-top: 48px; padding-bottom: 40px;
        }
        .footer-logo { height: 60px; filter: brightness(0) invert(1); opacity: 0.9; margin-bottom: 12px; }
        .footer-tagline { font-family: var(--font-serif); font-size: 14px; color: var(--gold); margin-bottom: 10px; }
        .footer-desc { font-size: 13px; line-height: 1.7; color: rgba(232,213,183,0.7); }
        .footer-links h4, .footer-categories h4, .footer-contact h4 {
          font-family: var(--font-serif); font-size: 16px; color: var(--gold);
          margin-bottom: 14px; padding-bottom: 8px;
          border-bottom: 1px solid rgba(200,169,110,0.3);
        }
        .footer-links a, .footer-categories a {
          display: block; font-size: 13px; color: rgba(232,213,183,0.75);
          margin-bottom: 8px; transition: color 0.2s;
        }
        .footer-links a:hover, .footer-categories a:hover { color: var(--gold); }
        .contact-row {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: rgba(232,213,183,0.75);
          margin-bottom: 10px; transition: color 0.2s;
        }
        .contact-row:hover { color: var(--gold); }
        .footer-bottom { border-top: 1px solid rgba(200,169,110,0.2); }
        .footer-bottom-inner { padding: 16px 0; text-align: center; font-size: 13px; color: rgba(232,213,183,0.5); }
        @media (max-width: 900px) {
          .footer-inner { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1/-1; }
        }
        @media (max-width: 600px) {
          .footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
