
import React from 'react';
import { FiMapPin, FiPhone, FiClock, FiNavigation } from 'react-icons/fi';

export default function VisitStorePage() {
  return (
    <div className="visit-page">
      <div className="visit-hero">
        <div className="page-container">
          <h1 className="visit-title">Visit Our Store</h1>
          <p className="visit-sub">Come experience the full SR Fashions collection in person</p>
        </div>
      </div>
      <div className="page-container visit-content">
        <div className="visit-grid">
          {/* Store info */}
          <div className="visit-info-card card">
            <h2 style={{color:'var(--navy)',marginBottom:'24px'}}>Store Information</h2>
            <div className="info-row"><FiMapPin size={20} style={{color:'var(--gold)',flexShrink:0}}/><div><strong>Address</strong><p>SR Fashions, near water plant,<br/>Tempalli, Gannavaram Mandal,<br/>Vijayawada, Krishna District,<br/>Andhra Pradesh — 521286</p></div></div>
            <div className="info-row"><FiPhone size={20} style={{color:'var(--gold)',flexShrink:0}}/><div><strong>Phone</strong><a href="tel:7659983786" style={{color:'var(--navy)'}}>7659983786</a></div></div>
            <div className="info-row"><FiClock size={20} style={{color:'var(--gold)',flexShrink:0}}/><div><strong>Store Hours</strong><p>Monday – Saturday: 9:00 AM – 9:00 PM<br/>Sunday: 10:00 AM – 7:00 PM</p></div></div>
            <a href="https://maps.google.com/?q=Tempalli+Gannavaram+Vijayawada+Krishna+Andhra+Pradesh" target="_blank" rel="noreferrer" className="btn-primary" style={{display:'inline-flex',alignItems:'center',gap:'8px',marginTop:'16px'}}>
              <FiNavigation/> Get Directions
            </a>
          </div>
          {/* Map */}
          <div className="visit-map-wrap card" style={{overflow:'hidden',minHeight:'400px'}}>
            <iframe
              title="SR Fashions Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30673.5!2d80.8!3d16.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVGVtcGFsbGksIEdBTk5BVkFSQU0!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{border:0,minHeight:'400px'}} allowFullScreen loading="lazy"
            />
          </div>
        </div>

        {/* Gallery placeholder */}
        <div className="gallery-section">
          <h2 style={{color:'var(--navy)',marginBottom:'20px',textAlign:'center'}}>Our Store Gallery</h2>
          <p style={{textAlign:'center',color:'var(--text-light)',marginBottom:'28px'}}>Store photos will be displayed here. Upload via Admin Dashboard → Content → Shop Photos.</p>
          <div className="gallery-placeholder-grid">
            {Array(6).fill(0).map((_,i) => (
              <div key={i} className="gallery-placeholder skeleton" style={{height:'200px',borderRadius:'12px'}}/>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .visit-hero { background: linear-gradient(135deg, var(--navy), var(--navy-light)); padding: 60px 0; text-align: center; }
        .visit-title { color: var(--white); font-size: 2.2rem; margin-bottom: 10px; }
        .visit-sub { color: rgba(255,255,255,0.8); font-size: 16px; }
        .visit-content { padding: 48px 20px 60px; }
        .visit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 48px; }
        .visit-info-card { padding: 32px; }
        .info-row { display: flex; gap: 16px; margin-bottom: 24px; }
        .info-row strong { display: block; color: var(--navy); font-family: var(--font-serif); margin-bottom: 4px; }
        .info-row p { color: var(--text-mid); font-size: 15px; line-height: 1.7; }
        .gallery-placeholder-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 768px) { .visit-grid { grid-template-columns: 1fr; } .gallery-placeholder-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .gallery-placeholder-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
