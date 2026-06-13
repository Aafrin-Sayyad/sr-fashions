
import React from 'react';
import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

export default function VisitPage() {
  return (
    <div className="visit-page page-container">
      <h1 className="visit-title">Visit Our Store</h1>
      <div className="visit-grid">
        <div>
          <div className="store-info card">
            <h2><FiMapPin style={{color:'var(--gold)'}}/> Store Address</h2>
            <p className="store-addr">SR Fashions<br/>Near Water Plant, Tempalli<br/>Gannavaram Mandal, Vijayawada<br/>Krishna District, Andhra Pradesh — 521286</p>
            <a href="tel:7659983786" className="info-row"><FiPhone/> 7659983786</a>
            <a href="mailto:dastagiris553@gmail.com" className="info-row"><span style={{fontSize:'16px'}}>✉</span> dastagiris553@gmail.com</a>
            <div className="info-row"><FiClock/> Mon–Sun: 9:00 AM – 9:00 PM</div>
            <a href="https://maps.google.com/?q=Tempalli+Gannavaram+Vijayawada" target="_blank" rel="noreferrer" className="btn-primary" style={{marginTop:'16px', display:'inline-flex', gap:'8px'}}>
              📍 Open in Google Maps
            </a>
          </div>
          <div className="card intro-video-section">
            <h3>Store Introduction</h3>
            <p style={{color:'var(--text-light)',fontSize:'14px',marginBottom:'12px'}}>Watch our store introduction video</p>
            <div className="video-placeholder">
              <span style={{fontSize:'48px'}}>🎬</span>
              <p>Upload your intro video via Admin Panel</p>
            </div>
          </div>
        </div>
        <div>
          <div className="card photos-section">
            <h2>Store Photos</h2>
            <div className="photos-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="photo-placeholder"><span>📸</span><p>Add photos via Admin</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .visit-page { padding: 40px 20px 60px; }
        .visit-title { color: var(--navy); font-size: 2rem; margin-bottom: 28px; }
        .visit-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; align-items: start; }
        .store-info { padding: 28px; margin-bottom: 20px; }
        .store-info h2 { font-family: var(--font-serif); color: var(--navy); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .store-addr { font-size: 15px; color: var(--text-mid); line-height: 1.8; margin-bottom: 16px; }
        .info-row { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-mid); margin-bottom: 10px; transition: color 0.2s; }
        .info-row:hover { color: var(--navy); }
        .intro-video-section { padding: 24px; }
        .intro-video-section h3 { font-family: var(--font-serif); color: var(--navy); margin-bottom: 8px; }
        .video-placeholder { background: var(--cream-dark); border-radius: var(--radius); padding: 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .video-placeholder p { font-size: 13px; color: var(--text-light); }
        .photos-section { padding: 24px; }
        .photos-section h2 { font-family: var(--font-serif); color: var(--navy); margin-bottom: 16px; }
        .photos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .photo-placeholder { aspect-ratio: 1; background: var(--cream-dark); border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 24px; color: var(--text-light); }
        .photo-placeholder p { font-size: 11px; color: var(--text-light); text-align: center; }
        @media (max-width: 768px) { .visit-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
