
import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiMessageCircle } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <div className="contact-page page-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-sub">We're always here to help you. Reach out anytime!</p>
      <div className="contact-grid">
        <a href="tel:7659983786" className="contact-card card">
          <FiPhone size={36} className="contact-icon"/>
          <h3>Call Us</h3>
          <p>7659983786</p>
          <span className="contact-action">Tap to Call</span>
        </a>
        <a href="mailto:dastagiris553@gmail.com" className="contact-card card">
          <FiMail size={36} className="contact-icon"/>
          <h3>Email Us</h3>
          <p>dastagiris553@gmail.com</p>
          <span className="contact-action">Send Email</span>
        </a>
        <a href="https://wa.me/917659983786" target="_blank" rel="noreferrer" className="contact-card card whatsapp">
          <FiMessageCircle size={36} className="contact-icon"/>
          <h3>WhatsApp</h3>
          <p>7659983786</p>
          <span className="contact-action">Chat on WhatsApp</span>
        </a>
        <div className="contact-card card">
          <FiMapPin size={36} className="contact-icon"/>
          <h3>Visit Us</h3>
          <p>SR Fashions, near water plant, Tempalli, Gannavaram Mandal, Vijayawada, Krishna Dist, AP - 521286</p>
          <a href="https://maps.google.com/?q=Tempalli+Gannavaram+Mandal+Vijayawada" target="_blank" rel="noreferrer" className="contact-action">Get Directions</a>
        </div>
      </div>
      <style>{`
        .contact-page { padding: 48px 20px 80px; }
        .contact-title { color: var(--navy); font-size: 2rem; margin-bottom: 8px; }
        .contact-sub { color: var(--text-light); margin-bottom: 36px; font-size: 15px; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .contact-card { padding: 32px 24px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .contact-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
        .contact-icon { color: var(--navy); }
        .contact-card.whatsapp .contact-icon { color: #25d366; }
        .contact-card h3 { font-family: var(--font-serif); color: var(--navy); font-size: 1.1rem; }
        .contact-card p { color: var(--text-mid); font-size: 14px; }
        .contact-action { color: var(--gold-dark); font-size: 13px; font-family: var(--font-serif); text-decoration: underline; margin-top: 6px; }
      `}</style>
    </div>
  );
}
