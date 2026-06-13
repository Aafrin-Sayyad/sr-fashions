
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/products?search=${encodeURIComponent(searchQ.trim())}`);
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="page-container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="SR Fashions" className="logo-img" />
        </Link>

        {/* Search bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Search by product name or ID..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <FiSearch />
          </button>
        </form>

        {/* Desktop Nav links */}
        <nav className="navbar-links">
          <Link to="/products">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/visit">Visit Store</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <FiShoppingCart size={22} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          {user ? (
            <div className="user-menu">
              <button className="user-avatar-btn">
                <span className="user-avatar">{user.name?.[0]?.toUpperCase()}</span>
              </button>
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <strong>{user.name}</strong>
                  <small>{user.email || user.phone}</small>
                </div>
                <Link to="/orders"><FiUser size={14} /> My Orders</Link>
                {user.role === 'admin' && <Link to="/admin"><FiSettings size={14} /> Admin Panel</Link>}
                <button onClick={logout}><FiLogOut size={14} /> Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>Login</Link>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu slide-down">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input className="search-input" placeholder="Search products..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            <button type="submit"><FiSearch /></button>
          </form>
          <nav className="mobile-nav">
            <Link to="/products">Shop All</Link>
            <Link to="/about">About Us</Link>
            <Link to="/visit">Visit Store</Link>
            <Link to="/contact">Contact</Link>
            {user ? (
              <>
                <Link to="/orders">My Orders</Link>
                {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                <button className="logout-link" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="mobile-login">Login / Sign Up</Link>
            )}
          </nav>
        </div>
      )}

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 1000;
          background: var(--white);
          border-bottom: 1.5px solid var(--gold-light);
          transition: box-shadow 0.3s;
        }
        .navbar.scrolled { box-shadow: var(--shadow-md); }
        .navbar-inner {
          display: flex; align-items: center; gap: 16px;
          padding-top: 10px; padding-bottom: 10px;
        }
        .navbar-logo { flex-shrink: 0; animation: logoFloat 3s ease-in-out infinite; }
        .logo-img { height: 54px; width: auto; }
        .navbar-search {
          flex: 1; display: flex; max-width: 480px;
          border: 1.5px solid var(--gold-light);
          border-radius: 6px; overflow: hidden;
          transition: var(--transition);
        }
        .navbar-search:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(26,58,92,0.08); }
        .search-input {
          flex: 1; padding: 10px 14px; border: none; background: transparent;
          font-family: var(--font-body); font-size: 14px; color: var(--text-dark);
        }
        .search-input::placeholder { color: var(--text-light); }
        .search-btn {
          padding: 10px 14px; background: var(--navy); color: var(--white);
          display: flex; align-items: center; border: none; cursor: pointer;
          transition: var(--transition);
        }
        .search-btn:hover { background: var(--navy-light); }
        .navbar-links { display: flex; gap: 24px; font-size: 14px; font-family: var(--font-serif); }
        .navbar-links a { color: var(--text-dark); transition: color 0.2s; font-weight: 500; }
        .navbar-links a:hover { color: var(--navy); }
        .navbar-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        .cart-btn {
          position: relative; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; background: var(--cream-dark); color: var(--navy);
          transition: var(--transition);
        }
        .cart-btn:hover { background: var(--navy); color: var(--white); }
        .cart-badge {
          position: absolute; top: -4px; right: -4px;
          background: var(--gold); color: var(--navy);
          font-size: 10px; font-weight: 700; min-width: 18px; height: 18px;
          border-radius: 9px; display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }
        .user-menu { position: relative; }
        .user-avatar-btn { background: none; border: none; cursor: pointer; }
        .user-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--navy); color: var(--white);
          font-family: var(--font-serif); font-weight: 700; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .user-dropdown {
          position: absolute; right: 0; top: 48px; min-width: 180px;
          background: var(--white); border: 1px solid var(--gold-light);
          border-radius: var(--radius); box-shadow: var(--shadow-lg);
          overflow: hidden; z-index: 100;
          display: none;
        }
        .user-menu:hover .user-dropdown { display: block; animation: fadeIn 0.2s ease; }
        .user-dropdown-header { padding: 12px 16px; background: var(--cream); border-bottom: 1px solid var(--gold-light); }
        .user-dropdown-header strong { display: block; font-family: var(--font-serif); color: var(--navy); }
        .user-dropdown-header small { color: var(--text-light); font-size: 12px; }
        .user-dropdown a, .user-dropdown button {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; width: 100%; text-align: left;
          background: none; border: none; font-size: 14px; font-family: var(--font-body);
          color: var(--text-dark); cursor: pointer; transition: background 0.2s;
        }
        .user-dropdown a:hover, .user-dropdown button:hover { background: var(--cream); }
        .hamburger { display: none; background: none; border: none; color: var(--navy); padding: 4px; }
        .mobile-menu {
          background: var(--white); border-top: 1px solid var(--gold-light);
          padding: 16px 20px;
        }
        .mobile-search { display: flex; gap: 8px; margin-bottom: 16px; }
        .mobile-search .search-input {
          flex: 1; padding: 10px 14px; border: 1.5px solid var(--gold-light);
          border-radius: var(--radius); font-size: 14px;
        }
        .mobile-search button {
          padding: 10px 14px; background: var(--navy); color: var(--white);
          border: none; border-radius: var(--radius); cursor: pointer;
        }
        .mobile-nav { display: flex; flex-direction: column; gap: 2px; }
        .mobile-nav a, .logout-link, .mobile-login {
          padding: 12px 8px; font-size: 15px; font-family: var(--font-serif);
          color: var(--text-dark); border-radius: var(--radius); background: none; border: none;
          text-align: left; cursor: pointer; transition: background 0.2s;
          display: block; width: 100%;
        }
        .mobile-nav a:hover, .logout-link:hover { background: var(--cream); }
        .mobile-login { background: var(--navy); color: var(--white); text-align: center; margin-top: 8px; padding: 12px; }
        @media (max-width: 900px) {
          .navbar-links { display: none; }
          .hamburger { display: flex; }
          .navbar-search { max-width: 260px; }
        }
        @media (max-width: 600px) {
          .navbar-search { display: none; }
          .logo-img { height: 44px; }
        }
      `}</style>
    </header>
  );
}
