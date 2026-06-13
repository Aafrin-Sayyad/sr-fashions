
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post('/auth/admin-login', { email, password });
      if (r.data.user.role !== 'admin') { toast.error('Not an admin account'); return; }
      login(r.data.token, r.data.user);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box fade-in">
        <div className="admin-login-header">
          <FiLock size={32} color="var(--gold)"/>
          <h2>Admin Login</h2>
          <p>SR Fashions — Staff Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.7)',marginBottom:'7px'}}>Admin Email</label>
            <input className="admin-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@srfashions.com" required/>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.7)',marginBottom:'7px'}}>Password</label>
            <input className="admin-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
          </div>
          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'16px',fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>
          <a href="/" style={{color:'var(--gold)'}}>← Back to Store</a>
        </p>
      </div>
      <style>{`
        .admin-login-page { min-height:100vh; background:var(--navy); display:flex; align-items:center; justify-content:center; padding:20px; }
        .admin-login-box { width:100%; max-width:400px; background:rgba(255,255,255,0.06); border:1px solid rgba(200,169,110,0.3); border-radius:var(--radius-lg); padding:40px; }
        .admin-login-header { text-align:center; margin-bottom:28px; }
        .admin-login-header h2 { color:var(--white); font-size:1.5rem; margin:12px 0 4px; }
        .admin-login-header p { color:rgba(255,255,255,0.5); font-size:13px; }
        .admin-input { width:100%; padding:12px 16px; background:rgba(255,255,255,0.08); border:1px solid rgba(200,169,110,0.3); border-radius:var(--radius); color:var(--white); font-size:15px; font-family:var(--font-body); transition:border 0.2s; }
        .admin-input::placeholder { color:rgba(255,255,255,0.3); }
        .admin-input:focus { border-color:var(--gold); outline:none; }
        .admin-submit-btn { width:100%; padding:14px; background:var(--gold); color:var(--navy); border:none; border-radius:var(--radius); font-family:var(--font-serif); font-size:16px; font-weight:700; cursor:pointer; transition:var(--transition); }
        .admin-submit-btn:hover:not(:disabled) { background:var(--gold-dark); color:var(--white); }
        .admin-submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
