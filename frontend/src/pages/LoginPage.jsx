
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // input | otp
  const [method, setMethod] = useState('email');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!value.trim()) return toast.error('Please enter your email or phone');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', method === 'email' ? { email: value } : { phone: value });
      toast.success('OTP sent! Check your ' + method);
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const r = await api.post('/auth/verify-otp', {
        ...(method === 'email' ? { email: value } : { phone: value }),
        otp, name
      });
      login(r.data.token, r.data.user);
      toast.success(`Welcome${r.data.user.name !== 'Customer' ? ', ' + r.data.user.name : ''}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-logo">
          <img src="/logo.png" alt="SR Fashions" style={{height:'70px', margin:'0 auto', display:'block'}}/>
        </div>
        <h2 className="login-title">Welcome to SR Fashions</h2>
        <p className="login-sub">Login or create your account to start shopping</p>

        {step === 'input' ? (
          <form onSubmit={sendOTP} className="login-form">
            <div className="method-tabs">
              <button type="button" className={`method-tab ${method==='email'?'active':''}`} onClick={()=>setMethod('email')}>
                <FiMail size={16}/> Email
              </button>
              <button type="button" className={`method-tab ${method==='phone'?'active':''}`} onClick={()=>setMethod('phone')}>
                <FiPhone size={16}/> Phone
              </button>
            </div>
            <div className="form-group">
              <label>{method === 'email' ? 'Email Address' : 'Phone Number (10 digits)'}</label>
              <input
                className="input-field"
                type={method === 'email' ? 'email' : 'tel'}
                placeholder={method === 'email' ? 'yourname@email.com' : '9876543210'}
                value={value}
                onChange={e => setValue(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Name (for new accounts)</label>
              <input className="input-field" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <button type="submit" className="btn-primary login-submit" disabled={loading}>
              {loading ? 'Sending OTP...' : <><FiArrowRight/> Send OTP</>}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="login-form">
            <p className="otp-sent-msg">
              📩 OTP sent to <strong>{value}</strong>
            </p>
            <div className="form-group">
              <label>Enter 6-digit OTP</label>
              <input
                className="input-field otp-input"
                type="text" inputMode="numeric" maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                required autoFocus
              />
            </div>
            <button type="submit" className="btn-primary login-submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" className="resend-btn" onClick={() => { setStep('input'); setOtp(''); }}>
              ← Change {method}
            </button>
          </form>
        )}

        <div className="login-admin-link">
          Admin? <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 80vh; display: flex; align-items: center; justify-content: center;
          padding: 40px 20px; background: linear-gradient(135deg, var(--cream) 60%, var(--gold-light) 100%);
        }
        .login-card { width: 100%; max-width: 440px; padding: 40px; }
        .login-logo { margin-bottom: 20px; }
        .login-title { font-size: 1.5rem; color: var(--navy); text-align: center; margin-bottom: 6px; }
        .login-sub { text-align: center; color: var(--text-light); font-size: 14px; margin-bottom: 28px; }
        .method-tabs { display: flex; background: var(--cream-dark); border-radius: var(--radius); padding: 4px; gap: 4px; margin-bottom: 20px; }
        .method-tab {
          flex: 1; padding: 9px; border-radius: 6px; border: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-family: var(--font-serif); font-size: 14px; cursor: pointer; transition: var(--transition);
          background: transparent; color: var(--text-mid);
        }
        .method-tab.active { background: var(--white); color: var(--navy); box-shadow: var(--shadow-sm); }
        .login-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; color: var(--text-mid); font-family: var(--font-serif); }
        .login-submit { width: 100%; justify-content: center; padding: 14px; font-size: 16px; }
        .otp-input { font-size: 24px; letter-spacing: 8px; text-align: center; font-weight: 700; }
        .otp-sent-msg { background: var(--cream); padding: 12px 16px; border-radius: var(--radius); font-size: 14px; color: var(--text-mid); }
        .resend-btn { background: none; border: none; color: var(--navy); font-size: 14px; cursor: pointer; text-decoration: underline; }
        .login-admin-link { text-align: center; margin-top: 20px; font-size: 13px; color: var(--text-light); }
        .login-admin-link a { color: var(--navy); text-decoration: underline; }
      `}</style>
    </div>
  );
}
