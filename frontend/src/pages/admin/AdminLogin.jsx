
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
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
      login(r.data.token, r.data.user);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card card">
        <img src="/logo.png" alt="SR Fashions" style={{height:'60px', margin:'0 auto 16px', display:'block'}}/>
        <h2>Admin Access</h2>
        <p>SR Fashions Management Panel</p>
        <form onSubmit={handleSubmit} className="admin-form">
          <input className="input-field" type="email" placeholder="Admin Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button type="submit" className="btn-primary" style={{width:'100%', justifyContent:'center', padding:'13px'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>
      </div>
      <style>{`
        .admin-login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--navy); padding:20px; }
        .admin-login-card { max-width:380px; width:100%; padding:40px; text-align:center; }
        .admin-login-card h2 { color:var(--navy); margin-bottom:4px; }
        .admin-login-card p { color:var(--text-light); font-size:13px; margin-bottom:24px; }
        .admin-form { display:flex; flex-direction:column; gap:12px; }
      `}</style>
    </div>
  );
}
