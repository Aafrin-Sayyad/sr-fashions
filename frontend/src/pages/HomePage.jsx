
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { FiArrowRight, FiStar, FiGift, FiTruck } from 'react-icons/fi';

const CATEGORIES = [
  { slug: 'sarees',         label: 'Sarees',          icon: '🥻', desc: 'Pattu, Silk, Fancy & more' },
  { slug: 'kids-wear',      label: "Kids Wear",        icon: '👶', desc: 'Newborn to 12 years' },
  { slug: 'mens-wear',      label: "Men's Wear",       icon: '👔', desc: 'Shirts, Jeans, Formals' },
  { slug: 'womens-wear',    label: "Women's Wear",     icon: '👗', desc: 'Tops, Leggings, Nighties' },
  { slug: 'wedding',        label: 'Wedding Wear',     icon: '💍', desc: 'Bridal & Groom outfits' },
  { slug: 'uniforms',       label: 'Uniforms',         icon: '🎒', desc: 'All school uniforms' },
  { slug: 'innerwear',      label: 'Innerwear',        icon: '🧦', desc: 'Men & Women' },
  { slug: 'home-textiles',  label: 'Home Textiles',    icon: '🛏️', desc: 'Bed sheets, Curtains' },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [premiumItems, setPremiumItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=8&sort=newest'),
      api.get('/products?isPremium=true&limit=4')
    ]).then(([n, p]) => {
      setNewArrivals(n.data.products || []);
      setPremiumItems(p.data.products || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content page-container">
          <div className="hero-text">
            {user ? (
              <p className="hero-greeting">Welcome back, <span className="greeting-name">{user.name}!</span> 👋</p>
            ) : (
              <p className="hero-eyebrow">★ Your Complete Family Store ★</p>
            )}
            <h1 className="hero-title">Fashion for<br/>Every Generation</h1>
            <p className="hero-subtitle">From 1-month babies to 90-year elders — SR Fashions has it all. Sarees, formals, casuals, school uniforms, home textiles and much more.</p>
            <div className="hero-cta">
              <button className="btn-gold hero-btn" onClick={() => navigate('/products')}>
                Shop Now <FiArrowRight />
              </button>
              <button className="btn-outline hero-btn" onClick={() => navigate('/visit')}>
                Visit Our Store
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-badge-grid">
              {['Sarees','Kids Wear','Men\'s','Women\'s','Wedding','Uniforms'].map(c => (
                <span key={c} className="hero-badge">{c}</span>
              ))}
            </div>
            <div className="hero-store-info">
              <p>📍 Tempalli, Gannavaram Mandal, Vijayawada</p>
              <p>📞 7659983786</p>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--cream)"/>
          </svg>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────── */}
      <div className="trust-strip page-container">
        {[
          { icon: <FiTruck/>, label: 'Quality Products', sub: 'Hand-picked for every customer' },
          { icon: <FiGift/>, label: 'Special Gifts', sub: 'Exclusive offers for customers' },
          { icon: <FiStar/>, label: 'Premium Collection', sub: 'Luxury fabrics & designs' },
          { icon: '📞',      label: 'Always Available', sub: 'Call: 7659983786' },
        ].map((t, i) => (
          <div key={i} className="trust-item">
            <span className="trust-icon">{t.icon}</span>
            <div><strong>{t.label}</strong><small>{t.sub}</small></div>
          </div>
        ))}
      </div>

      {/* ── Categories Grid ────────────────────────────────────── */}
      <section className="section page-container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="see-all">See All <FiArrowRight size={14}/></Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="category-tile">
              <span className="cat-icon">{cat.icon}</span>
              <strong className="cat-label">{cat.label}</strong>
              <small className="cat-desc">{cat.desc}</small>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ────────────────────────────────────────── */}
      <section className="section page-container">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/products?sort=newest" className="see-all">See All <FiArrowRight size={14}/></Link>
        </div>
        {loading ? (
          <div className="product-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{height: '340px', borderRadius: '16px'}}/>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="product-grid">
            {newArrivals.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        ) : (
          <div className="empty-state">
            <p>Products coming soon! Check back shortly.</p>
            <Link to="/visit" className="btn-primary">Visit Our Store</Link>
          </div>
        )}
      </section>

      {/* ── Premium Collection ─────────────────────────────────── */}
      {premiumItems.length > 0 && (
        <section className="premium-section">
          <div className="page-container">
            <div className="section-header">
              <h2 className="section-title" style={{color: 'var(--white)'}}>★ Premium Collection</h2>
              <Link to="/products?isPremium=true" className="see-all" style={{color: 'var(--gold)'}}>See All <FiArrowRight size={14}/></Link>
            </div>
            <div className="product-grid">
              {premiumItems.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── About Banner ────────────────────────────────────────── */}
      <section className="about-banner page-container">
        <div className="about-banner-inner">
          <div>
            <h2>SR Fashions — Your Complete Family Store</h2>
            <p>We carry everything your family needs — suiting & shirting, readymade dresses from 1-month babies to elders, all types of sarees (pattu, silk, fancy, wedding, work, design), kids wear, men's wear, women's wear, school uniforms, home textiles and more. Special gift offers for our valued customers!</p>
            <div style={{display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'20px'}}>
              <Link to="/about" className="btn-primary">About Us</Link>
              <Link to="/visit" className="btn-outline">Visit Store</Link>
            </div>
          </div>
          <div className="about-banner-features">
            {['Sarees (All Types)','Readymade Dresses','Kids Wear','Men\'s Wear','School Uniforms','Home Textiles','Innerwear','Wedding Wear'].map(f => (
              <span key={f} className="feature-chip">✓ {f}</span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* Hero */
        .hero-section {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 60%, #1e5080 100%);
          color: var(--white); padding: 60px 0 0; position: relative;
        }
        .hero-content {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center; padding-bottom: 60px;
        }
        .hero-eyebrow { color: var(--gold); font-family: var(--font-serif); font-size: 14px; letter-spacing: 1px; margin-bottom: 12px; }
        .hero-greeting { color: var(--gold); font-family: var(--font-serif); font-size: 16px; margin-bottom: 12px; }
        .greeting-name { font-style: italic; }
        .hero-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.15; margin-bottom: 18px; color: var(--white); }
        .hero-subtitle { font-size: 16px; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 28px; }
        .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
        .hero-btn { padding: 14px 28px; font-size: 15px; }
        .btn-outline { border-color: rgba(255,255,255,0.5); color: var(--white); }
        .btn-outline:hover { background: rgba(255,255,255,0.1); color: var(--white); border-color: var(--white); }
        .hero-badge-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .hero-badge {
          background: rgba(200,169,110,0.15); border: 1px solid rgba(200,169,110,0.4);
          color: var(--gold-light); padding: 8px 16px; border-radius: 99px;
          font-family: var(--font-serif); font-size: 13px;
        }
        .hero-store-info { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; }
        .hero-wave { line-height: 0; }
        .hero-wave svg { width: 100%; height: 60px; display: block; }

        /* Trust */
        .trust-strip {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          padding: 24px 20px; margin: 20px auto;
          background: var(--white); border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        .trust-item { display: flex; align-items: center; gap: 12px; }
        .trust-icon { font-size: 24px; color: var(--navy); }
        .trust-item strong { display: block; font-family: var(--font-serif); font-size: 14px; color: var(--navy); }
        .trust-item small { font-size: 12px; color: var(--text-light); }

        /* Section */
        .section { padding: 48px 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 28px; }
        .section-title { font-size: clamp(1.3rem, 2.5vw, 1.8rem); color: var(--navy); }
        .see-all { display: flex; align-items: center; gap: 4px; color: var(--navy); font-size: 14px; font-family: var(--font-serif); transition: color 0.2s; }
        .see-all:hover { color: var(--gold-dark); }

        /* Categories */
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
        .category-tile {
          background: var(--white); border-radius: var(--radius-lg);
          padding: 22px 16px; text-align: center;
          border: 1.5px solid var(--gold-light); transition: var(--transition);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .category-tile:hover { border-color: var(--navy); box-shadow: var(--shadow-md); transform: translateY(-3px); background: var(--cream); }
        .cat-icon { font-size: 32px; }
        .cat-label { font-family: var(--font-serif); font-size: 14px; color: var(--navy); font-weight: 600; }
        .cat-desc { font-size: 11px; color: var(--text-light); }

        /* Products grid */
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }

        /* Empty */
        .empty-state { text-align: center; padding: 48px; color: var(--text-light); }
        .empty-state p { margin-bottom: 16px; font-size: 16px; }

        /* Premium Section */
        .premium-section { background: var(--navy); padding: 48px 0; }
        .premium-section .section-title { color: var(--white); }

        /* About Banner */
        .about-banner { padding: 40px 20px 60px; }
        .about-banner-inner {
          background: var(--white); border-radius: var(--radius-lg);
          padding: 40px; display: grid; grid-template-columns: 1.4fr 1fr;
          gap: 40px; align-items: center;
          border: 1.5px solid var(--gold-light); box-shadow: var(--shadow-sm);
        }
        .about-banner-inner h2 { font-size: 1.6rem; color: var(--navy); margin-bottom: 14px; }
        .about-banner-inner p { font-size: 15px; color: var(--text-mid); line-height: 1.7; }
        .about-banner-features { display: flex; flex-wrap: wrap; gap: 10px; }
        .feature-chip {
          background: var(--cream-dark); color: var(--navy);
          padding: 6px 14px; border-radius: 99px;
          font-size: 13px; font-family: var(--font-serif);
          border: 1px solid var(--gold-light);
        }

        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .trust-strip { grid-template-columns: repeat(2, 1fr); }
          .about-banner-inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .trust-strip { grid-template-columns: 1fr; }
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .categories-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
        }
      `}</style>
    </div>
  );
}
