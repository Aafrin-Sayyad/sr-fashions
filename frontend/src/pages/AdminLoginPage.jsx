
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';

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
      login(r.data.token, r.data.user);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <img src="/logo.png" alt="SR Fashions" style={{height:'60px',margin:'0 auto 16px',display:'block'}}/>
        <h2 style={{fontFamily:'var(--font-serif)',color:'var(--navy)',textAlign:'center',marginBottom:'6px'}}>Admin Login</h2>
        <p style={{textAlign:'center',color:'var(--text-light)',fontSize:'13px',marginBottom:'28px'}}>SR Fashions Dashboard Access</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{position:'relative'}}>
            <FiMail style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--text-light)'}}/>
            <input className="input-field" style={{paddingLeft:'42px'}} type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div style={{position:'relative'}}>
            <FiLock style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--text-light)'}}/>
            <input className="input-field" style={{paddingLeft:'42px'}} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:'16px'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
      <style>{`.login-page{min-height:80vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:linear-gradient(135deg,var(--cream) 0%,var(--cream-dark) 100%)}.login-card{max-width:420px;width:100%;padding:40px}`}</style>
    </div>
  );
}
