
import React from 'react';
const FUNNIES = ['😿','🦕','🤖','🐙','🦔'];
export default function OfflinePage() {
  const emoji = FUNNIES[Math.floor(Math.random() * FUNNIES.length)];
  return (
    <div className="offline-page">
      <div className="offline-emoji">{emoji}</div>
      <h2 style={{fontFamily:'var(--font-serif)', color:'var(--navy)'}}>Oops! No Internet Connection</h2>
      <p style={{color:'var(--text-light)', maxWidth:'360px'}}>Looks like you wandered off the grid! Check your connection and we'll get you back to shopping.</p>
      <button className="btn-primary" style={{marginTop:'16px'}} onClick={()=>window.location.reload()}>Try Again</button>
    </div>
  );
}
