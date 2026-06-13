
import React, { useState, useEffect } from 'react';

const OFFLINE_MESSAGES = [
  { emoji: '📡', title: 'Signal Lost!', msg: 'Even our sarees need connectivity to reach you! Check your internet.' },
  { emoji: '🧵', title: 'Thread Disconnected!', msg: 'Our digital threads can\'t weave without internet. Please reconnect!' },
  { emoji: '🥻', title: 'Saree in the Wind!', msg: 'Your internet flew away like a saree in the wind. Please come back!' },
  { emoji: '🛍️', title: 'Shop is Offline!', msg: 'Even the best shop needs a connection. Check your wifi!' },
];

export default function OfflinePage() {
  const [msg] = useState(() => OFFLINE_MESSAGES[Math.floor(Math.random() * OFFLINE_MESSAGES.length)]);
  return (
    <div className="offline-page">
      <div style={{fontSize:'96px', animation:'pulse 2s infinite'}}>{msg.emoji}</div>
      <h2 style={{fontSize:'1.8rem', color:'var(--navy)'}}>{msg.title}</h2>
      <p style={{color:'var(--text-mid)', fontSize:'16px', maxWidth:'380px'}}>{msg.msg}</p>
      <p style={{color:'var(--text-light)', fontSize:'13px'}}>SR Fashions — near water plant, Tempalli, Vijayawada</p>
      <button className="btn-primary" onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
}
