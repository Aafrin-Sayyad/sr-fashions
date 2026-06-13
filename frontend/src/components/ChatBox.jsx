
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

export default function ChatBox() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (open && user) {
      api.get('/chat/my').then(r => setMessages(r.data.messages || [])).catch(() => {});
    }
  }, [open, user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    const msg = text;
    setText('');
    setMessages(prev => [...prev, { sender: 'user', text: msg, createdAt: new Date() }]);
    try {
      const r = await api.post('/chat/message', { text: msg });
      setMessages(r.data.messages || []);
    } catch {}
  };

  if (!user) return null;

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Chat">
        {open ? <FiX size={22}/> : <FiMessageCircle size={22}/>}
      </button>
      {open && (
        <div className="chat-window fade-in">
          <div className="chat-header">
            <span>💬 Chat with SR Fashions</span>
            <button onClick={() => setOpen(false)}><FiX size={18}/></button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && (
              <p className="chat-empty">👋 Hi {user.name}! How can we help you today?</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender}`}>
                <span>{m.text}</span>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <form className="chat-input-row" onSubmit={send}>
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button type="submit" className="chat-send" disabled={!text.trim()}>
              <FiSend size={16}/>
            </button>
          </form>
        </div>
      )}
      <style>{`
        .chat-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 900;
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--navy); color: var(--white);
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-lg); transition: var(--transition);
          border: none; cursor: pointer;
        }
        .chat-fab:hover { background: var(--gold); color: var(--navy); transform: scale(1.08); }
        .chat-window {
          position: fixed; bottom: 96px; right: 28px; z-index: 900;
          width: 320px; max-height: 480px;
          background: var(--white); border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg); border: 1px solid var(--gold-light);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .chat-header {
          background: var(--navy); color: var(--white);
          padding: 14px 16px; font-family: var(--font-serif); font-size: 14px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .chat-header button { background: none; border: none; color: var(--gold-light); cursor: pointer; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
        .chat-empty { font-size: 14px; color: var(--text-mid); text-align: center; padding: 20px; }
        .chat-bubble {
          max-width: 80%; padding: 9px 13px; border-radius: 12px; font-size: 14px; line-height: 1.5;
        }
        .chat-bubble.user { background: var(--navy); color: var(--white); align-self: flex-end; border-bottom-right-radius: 4px; }
        .chat-bubble.admin { background: var(--cream-dark); color: var(--text-dark); align-self: flex-start; border-bottom-left-radius: 4px; }
        .chat-input-row {
          display: flex; border-top: 1px solid var(--gold-light); padding: 10px 12px; gap: 8px;
        }
        .chat-input {
          flex: 1; border: 1px solid var(--gold-light); border-radius: 20px;
          padding: 8px 14px; font-size: 14px; font-family: var(--font-body);
        }
        .chat-send {
          width: 36px; height: 36px; border-radius: 50%; background: var(--navy); color: var(--white);
          display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;
          transition: var(--transition);
        }
        .chat-send:hover:not(:disabled) { background: var(--gold); color: var(--navy); }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 400px) { .chat-window { width: calc(100vw - 32px); right: 16px; } }
      `}</style>
    </>
  );
}
