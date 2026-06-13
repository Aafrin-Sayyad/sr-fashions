// ============================================================
//  COMPONENT: Navbar
//  Responsive, sticky, search, cart badge, user menu
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SRFashionsLogo from "./SRFashionsLogo";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const CATEGORIES = [
  "Sarees","Womens Wear","Mens Wear","Kids Wear",
  "Wedding Collection","School Uniforms","Home & Furnishings",
  "Innerwear & Nightwear","Premium Collection",
];

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRes,   setSearchRes]   = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  const searchRef = useRef(null);
  const userRef   = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMenuOpen(false); setUserOpen(false); setCatOpen(false);
  }, [location]);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchRes([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await axios.get(`/api/products?search=${searchQuery}&limit=6`);
        setSearchRes(data.products || []);
      } catch { setSearchRes([]); }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); setSearchRes([]);
    }
  };

  return (
    <>
      {/* ── Top strip ──────────────────────────────────── */}
      <div style={{ background: "var(--crimson-dark)", color: "var(--gold-light)", fontSize: "0.78rem", textAlign: "center", padding: "6px 20px", letterSpacing: "0.5px" }}>
        🎁 Special Offer Gifts for Our Valued Customers! &nbsp;|&nbsp; 📞 7659983786 &nbsp;|&nbsp; 📍 SR Fashions, Tempalli, Vijayawada
      </div>

      {/* ── Main Navbar ────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: "var(--white)",
        boxShadow: scrolled ? "0 2px 20px rgba(139,26,26,0.15)" : "0 1px 0 var(--gray-light)",
        transition: "box-shadow 0.3s ease",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", flexWrap: "wrap" }}>

          {/* Logo */}
          <SRFashionsLogo size="normal" linkTo="/" />

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 200, maxWidth: 500, position: "relative" }} ref={searchRef}>
            <div style={{ display: "flex", border: "2px solid var(--crimson)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID (e.g. SRF-A1B2C3D4)..."
                style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontFamily: "'Times New Roman', Times, serif", fontSize: "0.9rem", background: "var(--ivory)" }}
              />
              <button type="submit" style={{ background: "var(--crimson)", color: "var(--white)", padding: "0 18px", border: "none", cursor: "pointer", fontSize: "1.1rem" }}>
                🔍
              </button>
            </div>
            {/* Search suggestions */}
            <AnimatePresence>
              {(searchRes.length > 0 || searching) && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--white)", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", overflow: "hidden", zIndex: 999 }}
                >
                  {searching ? (
                    <div style={{ padding: "16px", textAlign: "center", color: "var(--gray)" }}>
                      <div className="spinner" style={{ width: 24, height: 24, margin: "0 auto 8px" }} />
                      <span style={{ fontSize: "0.85rem" }}>Please wait...</span>
                    </div>
                  ) : (
                    searchRes.map((p) => (
                      <Link
                        key={p._id}
                        to={`/products/${p._id}`}
                        onClick={() => { setSearchQuery(""); setSearchRes([]); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid var(--gray-light)", transition: "background 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--ivory)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 4 }} />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gray)" }}>{p.productId} · {p.category}</div>
                        </div>
                        <div style={{ marginLeft: "auto", color: "var(--crimson)", fontWeight: 700, fontSize: "0.9rem" }}>
                          ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                        </div>
                      </Link>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

            {/* Categories dropdown */}
            <div style={{ position: "relative" }} ref={userRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                style={{ background: "none", color: "var(--charcoal)", padding: "8px 12px", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, fontSize: "0.95rem" }}
              >
                ☰ Categories {catOpen ? "▲" : "▼"}
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: "var(--white)", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", minWidth: 220, overflow: "hidden", zIndex: 999 }}
                  >
                    <Link to="/products" style={{ display: "block", padding: "10px 16px", borderBottom: "2px solid var(--gold)", fontWeight: 700, color: "var(--crimson)", fontSize: "0.9rem" }}>
                      🛍️ All Products
                    </Link>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        style={{ display: "block", padding: "9px 16px", borderBottom: "1px solid var(--gray-light)", color: "var(--charcoal)", fontSize: "0.9rem", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ivory)"; e.currentTarget.style.color = "var(--crimson)"; e.currentTarget.style.paddingLeft = "22px"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.paddingLeft = "16px"; }}
                      >
                        {cat === "Premium Collection" ? "⭐ " : ""}{cat}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" style={{ padding: "8px 12px", fontWeight: 600, color: "var(--charcoal)", fontSize: "0.95rem", whiteSpace: "nowrap" }}>About Us</Link>
            <Link to="/visit-shop" style={{ padding: "8px 12px", fontWeight: 600, color: "var(--charcoal)", fontSize: "0.95rem", whiteSpace: "nowrap" }}>Visit Shop</Link>
            <Link to="/contact" style={{ padding: "8px 12px", fontWeight: 600, color: "var(--charcoal)", fontSize: "0.95rem", whiteSpace: "nowrap" }}>Contact</Link>

            {/* Cart */}
            <Link to="/cart" style={{ position: "relative", padding: "8px 12px", fontSize: "1.4rem" }}>
              🛒
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.4 }} animate={{ scale: 1 }}
                  style={{ position: "absolute", top: 2, right: 2, background: "var(--crimson)", color: "var(--white)", borderRadius: "50%", width: 18, height: 18, fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </Link>

            {/* User menu */}
            {isLoggedIn ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  style={{ background: "var(--crimson)", color: "var(--white)", padding: "8px 14px", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}
                >
                  👤 <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name?.split(" ")[0]}</span>
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--white)", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", minWidth: 180, overflow: "hidden", zIndex: 999 }}
                    >
                      <div style={{ padding: "12px 16px", background: "var(--ivory)", borderBottom: "1px solid var(--gray-light)" }}>
                        <div style={{ fontWeight: 700, color: "var(--crimson)" }}>{user?.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--gray)" }}>{user?.email || user?.phone}</div>
                      </div>
                      <Link to="/my-orders" style={{ display: "block", padding: "10px 16px", borderBottom: "1px solid var(--gray-light)", color: "var(--charcoal)" }}>📦 My Orders</Link>
                      {isAdmin && <Link to="/admin" style={{ display: "block", padding: "10px 16px", borderBottom: "1px solid var(--gray-light)", color: "var(--crimson)", fontWeight: 600 }}>⚙️ Admin Dashboard</Link>}
                      <button onClick={logout} style={{ display: "block", width: "100%", padding: "10px 16px", color: "#C0392B", fontWeight: 600, textAlign: "left", background: "none" }}>🚪 Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link to="/login"    className="btn-outline"   style={{ padding: "8px 16px", fontSize: "0.9rem" }}>Login</Link>
                <Link to="/register" className="btn-primary"   style={{ padding: "8px 16px", fontSize: "0.9rem" }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
