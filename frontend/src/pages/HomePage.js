// ============================================================
//  PAGE: HomePage
//  Hero banner, categories grid, featured products, intro video
// ============================================================

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar   from "../components/common/Navbar";
import Footer   from "../components/common/Footer";
import ChatBox  from "../components/common/ChatBox";
import ProductCard from "../components/product/ProductCard";
import { useAuth } from "../context/AuthContext";

// ── Category card with sample image ──────────────────────
const CategoryCard = ({ cat, index }) => {
  const navigate = useNavigate();
  const icons = { "Sarees":"👗","Womens Wear":"👚","Mens Wear":"👔","Kids Wear":"🧒","Wedding Collection":"💍","School Uniforms":"🎒","Home & Furnishings":"🏠","Innerwear & Nightwear":"🌙","Premium Collection":"⭐" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(139,26,26,0.2)" }}
      onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
      style={{
        cursor: "pointer", textAlign: "center", background: "var(--white)",
        borderRadius: "var(--radius-lg)", padding: "24px 16px",
        border: "2px solid transparent", boxShadow: "var(--shadow)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--gold)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
    >
      <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>{icons[cat.name] || "👗"}</div>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--charcoal)", marginBottom: 4 }}>{cat.name}</div>
      {cat.count > 0 && <div style={{ fontSize: "0.75rem", color: "var(--gray)" }}>{cat.count} items</div>}
    </motion.div>
  );
};

const HomePage = () => {
  const { isLoggedIn, user } = useAuth();
  const [categories, setCategories]     = useState([]);
  const [featured,   setFeatured]       = useState([]);
  const [newArrivals, setNewArrivals]   = useState([]);
  const [premium,     setPremium]       = useState([]);
  const [loading,     setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, featRes, newRes, premRes] = await Promise.all([
          axios.get("/api/products/categories"),
          axios.get("/api/products?isFeatured=true&limit=8"),
          axios.get("/api/products?isNewArrival=true&limit=8&sort=-createdAt"),
          axios.get("/api/products?isPremium=true&limit=8"),
        ]);
        setCategories(catRes.data);
        setFeatured(featRes.data.products);
        setNewArrivals(newRes.data.products);
        setPremium(premRes.data.products);
      } catch { /* graceful */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* ── Hero Banner ─────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, var(--crimson-dark) 0%, var(--crimson) 50%, #A0202A 100%)",
        position: "relative", overflow: "hidden", padding: "60px 20px 80px",
      }}>
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: "rgba(212,175,55,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, background: "rgba(212,175,55,0.06)", borderRadius: "50%" }} />

        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {isLoggedIn ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span style={{ background: "rgba(212,175,55,0.2)", color: "var(--gold-light)", padding: "6px 18px", borderRadius: 20, fontSize: "0.85rem", border: "1px solid rgba(212,175,55,0.3)" }}>
                ✨ Welcome back, {user?.name?.split(" ")[0]}!
              </span>
            </motion.div>
          ) : null}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--white)", marginTop: 20, marginBottom: 16, lineHeight: 1.15 }}
          >
            Elegance for Every
            <span style={{ color: "var(--gold-light)" }}> Family Member</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.7 }}
          >
            From newborn essentials to wedding collections — SR Fashions, Tempalli brings you the finest clothing for every occasion and every age.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link to="/products" className="btn-gold" style={{ fontSize: "1rem", padding: "14px 32px" }}>
              🛍️ Shop Now
            </Link>
            {!isLoggedIn && (
              <Link to="/register" style={{ background: "rgba(255,255,255,0.15)", color: "var(--white)", padding: "14px 32px", borderRadius: "var(--radius)", fontWeight: 600, border: "2px solid rgba(255,255,255,0.4)", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                👤 Create Account
              </Link>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}
          >
            {[{ label: "Products", value: "500+" }, { label: "Happy Families", value: "1000+" }, { label: "Categories", value: "9" }, { label: "Years of Trust", value: "10+" }].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center", color: "var(--white)" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--gold-light)" }}>{value}</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Intro Video ──────────────────────────────────── */}
      <section style={{ background: "var(--ivory-dark)", padding: "56px 20px" }}>
        <div className="container">
          <h2 className="section-title">🎬 Welcome to SR Fashions</h2>
          <div className="gold-divider" />
          <p style={{ textAlign: "center", color: "var(--gray)", marginBottom: 32, fontSize: "1rem" }}>
            Take a look at our beautiful showroom and collections
          </p>
          <div style={{ maxWidth: 720, margin: "0 auto", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "4px solid var(--gold)", aspectRatio: "16/9", background: "var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Replace src with your actual YouTube embed URL */}
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_HERE"
              title="SR Fashions Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <p style={{ textAlign: "center", color: "var(--gray)", marginTop: 12, fontSize: "0.85rem", fontStyle: "italic" }}>
            📍 SR Fashions, Near Water Plant, Tempalli, Gannavaram Mandal, Vijayawada — 521286
          </p>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section style={{ padding: "56px 20px" }}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="gold-divider" />
          <p style={{ textAlign: "center", color: "var(--gray)", marginBottom: 36 }}>
            Click a category to browse — or scroll down to see everything
          </p>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
              {Array(9).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: "var(--radius-lg)" }} />)}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
              {categories.map((cat, i) => <CategoryCard key={cat.name} cat={cat} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ padding: "40px 20px 56px", background: "var(--ivory-dark)" }}>
          <div className="container">
            <h2 className="section-title">✨ Featured Collection</h2>
            <div className="gold-divider" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginTop: 36 }}>
              {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link to="/products?isFeatured=true" className="btn-outline">View All Featured →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Premium Collection ───────────────────────────── */}
      {premium.length > 0 && (
        <section style={{ padding: "40px 20px 56px", background: "linear-gradient(135deg, #2C2C2C 0%, #1a1a1a 100%)" }}>
          <div className="container">
            <h2 className="section-title" style={{ color: "var(--gold-light)" }}>⭐ Premium Collection</h2>
            <div className="gold-divider" />
            <p style={{ textAlign: "center", color: "#ccc", marginBottom: 36 }}>Exclusive, handpicked for the discerning customer</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {premium.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link to="/products?isPremium=true" className="btn-gold">View Premium Collection →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ─────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section style={{ padding: "40px 20px 56px" }}>
          <div className="container">
            <h2 className="section-title">🆕 New Arrivals</h2>
            <div className="gold-divider" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginTop: 36 }}>
              {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link to="/products?isNewArrival=true" className="btn-outline">See All New Arrivals →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Special Offers Banner ────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)", padding: "48px 20px", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--charcoal)", marginBottom: 12 }}>🎁 Special Offer Gifts for Our Customers!</h2>
          <p style={{ color: "#5C3D00", fontSize: "1.05rem", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            Special surprise gifts available for our valued customers. Shop and celebrate with us!
          </p>
          <Link to="/products" className="btn-primary">Explore All Products →</Link>
        </div>
      </section>

      {/* ── All Products (no category filter) ───────────── */}
      <section style={{ padding: "56px 20px" }}>
        <div className="container">
          <h2 className="section-title">🛍️ All Products</h2>
          <div className="gold-divider" />
          <p style={{ textAlign: "center", color: "var(--gray)", marginBottom: 32 }}>
            Browse our complete collection — everything for your family
          </p>
          <AllProductsGrid />
        </div>
      </section>

      <Footer />
      <ChatBox />
    </div>
  );
};

// ── Inline all-products grid with pagination ─────────────
const AllProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const LIMIT = 16;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?page=${page}&limit=${LIMIT}&sort=-createdAt`);
        setProducts(data.products);
        setTotal(data.pagination.total);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  if (loading) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
      {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: "var(--radius-lg)" }} />)}
    </div>
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
      </div>
      {/* Pagination */}
      {total > LIMIT && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline" style={{ padding: "8px 20px" }}>← Prev</button>
          <span style={{ padding: "10px 20px", color: "var(--gray)" }}>Page {page} of {Math.ceil(total / LIMIT)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total} className="btn-outline" style={{ padding: "8px 20px" }}>Next →</button>
        </div>
      )}
    </>
  );
};

export default HomePage;
