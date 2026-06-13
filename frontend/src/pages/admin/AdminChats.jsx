
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/chat/admin/all').then(r => setChats(r.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, []);

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    try {
      await api.post(`/chat/admin/reply/${selected._id}`, { text: reply });
      setReply('');
      load();
      const updated = await api.get('/chat/admin/all');
      const updChat = updated.data.find(c => c._id === selected._id);
      if (updChat) setSelected(updChat);
      toast.success('Reply sent!');
    } catch { toast.error('Failed to send'); }
  };

  return (
    <div className="admin-chats">
      <h2 className="admin-page-title">Customer Chats</h2>
      <div className="chats-layout">
        <div className="chats-list card">
          {loading ? <div className="spinner" style={{margin:'20px auto'}}/> :
           chats.length === 0 ? <p style={{padding:'20px',color:'var(--text-light)',textAlign:'center'}}>No chats yet</p> :
           chats.map(chat => (
            <div key={chat._id} className={`chat-list-item ${selected?._id === chat._id ? 'active' : ''}`} onClick={() => setSelected(chat)}>
              <div className="chat-user-avatar">{chat.user?.name?.[0]?.toUpperCase() || '?'}</div>
              <div className="chat-user-info">
                <strong>{chat.user?.name || 'Anonymous'}</strong>
                <small>{chat.user?.phone || chat.user?.email || '—'}</small>
                <p className="chat-preview">{chat.messages?.[chat.messages.length-1]?.text?.slice(0,40) || 'No messages'}...</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-detail card">
          {!selected ? (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-light)',flexDirection:'column',gap:'12px'}}>
              <span style={{fontSize:'48px'}}>💬</span>
              <p>Select a chat to view messages</p>
            </div>
          ) : (
            <>
              <div className="chat-detail-header">
                <div className="chat-user-avatar">{selected.user?.name?.[0]?.toUpperCase()}</div>
                <div>
                  <strong style={{fontFamily:'var(--font-serif)',color:'var(--navy)'}}>{selected.user?.name}</strong>
                  <p style={{fontSize:'12px',color:'var(--text-light)'}}>{selected.user?.phone || selected.user?.email}</p>
                </div>
              </div>
              <div className="chat-messages-area">
                {selected.messages?.map((m, i) => (
                  <div key={i} className={`msg-bubble ${m.sender}`}>
                    <span>{m.text}</span>
                    <small>{new Date(m.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</small>
                  </div>
                ))}
              </div>
              <div className="chat-reply-bar">
                <input className="chat-input" placeholder="Type reply..." value={reply} onChange={e=>setReply(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter') sendReply(); }}/>
                <button className="chat-send" onClick={sendReply} disabled={!reply.trim()}><FiSend size={16}/></button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .admin-chats {}
        .chats-layout { display:grid; grid-template-columns:300px 1fr; gap:16px; height:70vh; }
        .chats-list { overflow-y:auto; }
        .chat-list-item { display:flex; gap:10px; padding:14px 16px; cursor:pointer; transition:background 0.15s; border-bottom:1px solid var(--cream-dark); }
        .chat-list-item:hover, .chat-list-item.active { background:var(--cream); }
        .chat-user-avatar { width:38px; height:38px; border-radius:50%; background:var(--navy); color:var(--white); display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-weight:700; flex-shrink:0; }
        .chat-user-info strong { display:block; font-family:var(--font-serif); color:var(--navy); font-size:14px; }
        .chat-user-info small { font-size:11px; color:var(--text-light); }
        .chat-preview { font-size:12px; color:var(--text-light); margin-top:2px; }
        .chat-detail { display:flex; flex-direction:column; overflow:hidden; }
        .chat-detail-header { display:flex; gap:10px; align-items:center; padding:14px 16px; border-bottom:1px solid var(--gold-light); }
        .chat-messages-area { flex:1; overflow-y:auto; padding:14px 16px; display:flex; flex-direction:column; gap:8px; }
        .msg-bubble { max-width:80%; padding:9px 13px; border-radius:12px; font-size:13px; display:flex; flex-direction:column; gap:3px; }
        .msg-bubble small { font-size:10px; opacity:0.6; }
        .msg-bubble.user { background:var(--navy); color:var(--white); align-self:flex-start; border-bottom-left-radius:4px; }
        .msg-bubble.admin { background:var(--cream-dark); color:var(--text-dark); align-self:flex-end; border-bottom-right-radius:4px; }
        .chat-reply-bar { display:flex; gap:8px; padding:10px 14px; border-top:1px solid var(--gold-light); }
        .chat-input { flex:1; border:1.5px solid var(--gold-light); border-radius:20px; padding:9px 14px; font-size:14px; font-family:var(--font-body); }
        .chat-send { width:38px; height:38px; border-radius:50%; background:var(--navy); color:var(--white); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition); }
        .chat-send:hover:not(:disabled) { background:var(--gold); color:var(--navy); }
        .chat-send:disabled { opacity:0.4; cursor:not-allowed; }
        @media (max-width:700px) { .chats-layout { grid-template-columns:1fr; height:auto; } .chats-list { height:300px; } .chat-detail { height:400px; } }
      `}</style>
    </div>
  );
}
