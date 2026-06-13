
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import { FiBox, FiShoppingBag, FiUsers, FiMessageCircle, FiLogOut, FiPlus, FiTrendingUp, FiGrid, FiMenu, FiX } from 'react-icons/fi';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminChats from './AdminChats';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{background: color + '22', color}}>{icon}</div>
      <div><p className="stat-label">{label}</p><p className="stat-value">{value}</p></div>
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/orders?limit=5').then(r => setRecentOrders(r.data.orders || [])).catch(() => {});
  }, []);
  return (
    <div className="overview-page">
      <h2 className="admin-page-title">Dashboard Overview</h2>
      <div className="stats-grid">
        <StatCard icon={<FiShoppingBag size={22}/>} label="Total Orders" value={stats?.totalOrders ?? '—'} color="#1a3a5c"/>
        <StatCard icon={<FiUsers size={22}/>} label="Total Customers" value={stats?.totalUsers ?? '—'} color="#8b5cf6"/>
        <StatCard icon={<FiBox size={22}/>} label="Products Listed" value={stats?.totalProducts ?? '—'} color="#0ea5e9"/>
        <StatCard icon={<FiTrendingUp size={22}/>} label="Revenue" value={stats ? formatPrice(stats.revenue) : '—'} color="#27ae60"/>
      </div>
      <h3 className="sub-title">Recent Orders</h3>
      <div className="recent-orders card">
        <table className="orders-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o._id}>
                <td><strong>{o.orderId}</strong></td>
                <td>{o.user?.name || '—'}</td>
                <td>{formatPrice(o.total)}</td>
                <td><span className={`status-chip ${o.orderStatus}`}>{o.orderStatus}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (user?.role !== 'admin') { navigate('/admin/login'); return null; }

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <FiGrid/> },
    { path: '/admin/products', label: 'Products', icon: <FiBox/> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag/> },
    { path: '/admin/chats', label: 'Customer Chats', icon: <FiMessageCircle/> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/logo.png" alt="SR Fashions" style={{height:'44px'}}/>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={() => { logout(); navigate('/'); }}>
          <FiLogOut/> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX/> : <FiMenu/>}
          </button>
          <div className="admin-header-right">
            <span className="admin-name">👋 Hello, {user?.name}</span>
            <Link to="/" className="view-site-btn">View Site</Link>
          </div>
        </header>
        <main className="admin-content">
          <Routes>
            <Route index element={<AdminOverview/>}/>
            <Route path="products/*" element={<AdminProducts/>}/>
            <Route path="orders/*" element={<AdminOrders/>}/>
            <Route path="chats/*" element={<AdminChats/>}/>
          </Routes>
        </main>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}/>}

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: var(--cream); }
        .admin-sidebar {
          width: 240px; background: var(--navy); color: var(--white);
          display: flex; flex-direction: column; flex-shrink: 0;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .sidebar-brand { padding: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .admin-badge { background: var(--gold); color: var(--navy); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; text-transform: uppercase; }
        .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: var(--radius); color: rgba(255,255,255,0.75); font-size: 14px; font-family: var(--font-serif); transition: var(--transition); }
        .nav-item:hover, .nav-item.active { background: rgba(200,169,110,0.15); color: var(--gold-light); }
        .nav-item.active { background: rgba(200,169,110,0.2); color: var(--gold); font-weight: 600; }
        .sidebar-logout { margin: 12px; padding: 11px 14px; background: rgba(255,255,255,0.06); border: none; border-radius: var(--radius); color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; transition: var(--transition); }
        .sidebar-logout:hover { background: rgba(192,57,43,0.2); color: #ff6b6b; }
        .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .admin-header { background: var(--white); border-bottom: 1px solid var(--gold-light); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .sidebar-toggle { display: none; background: none; border: none; color: var(--navy); cursor: pointer; font-size: 22px; }
        .admin-header-right { display: flex; align-items: center; gap: 16px; }
        .admin-name { font-family: var(--font-serif); color: var(--navy); font-size: 14px; }
        .view-site-btn { font-size: 13px; color: var(--navy); text-decoration: underline; }
        .admin-content { flex: 1; padding: 28px; overflow-y: auto; }
        .admin-page-title { color: var(--navy); font-size: 1.5rem; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        .stat-card { padding: 20px; display: flex; align-items: center; gap: 14px; }
        .stat-icon { width: 48px; height: 48px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-label { font-size: 12px; color: var(--text-light); margin-bottom: 4px; }
        .stat-value { font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--navy); }
        .sub-title { color: var(--navy); font-size: 1.1rem; margin-bottom: 14px; }
        .recent-orders { overflow-x: auto; }
        .orders-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .orders-table th { text-align: left; padding: 10px 14px; border-bottom: 2px solid var(--gold-light); font-family: var(--font-serif); color: var(--navy); font-size: 13px; }
        .orders-table td { padding: 12px 14px; border-bottom: 1px solid var(--cream-dark); color: var(--text-mid); }
        .status-chip { font-size: 11px; padding: 3px 9px; border-radius: 99px; font-weight: 600; text-transform: uppercase; background: var(--cream-dark); color: var(--text-mid); }
        .status-chip.delivered { background: #eafaf1; color: var(--green); }
        .status-chip.placed { background: #fef9e7; color: var(--gold-dark); }
        .status-chip.shipped { background: #e8f4fd; color: #0ea5e9; }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99; }
        @media (max-width: 900px) {
          .admin-sidebar { position: fixed; left: -240px; top: 0; height: 100vh; z-index: 100; transition: left 0.3s; }
          .admin-sidebar.open { left: 0; }
          .sidebar-toggle { display: flex; }
          .sidebar-overlay { display: block; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
