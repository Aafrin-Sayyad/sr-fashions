// ============================================================
//  COMPONENT: Footer
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import SRFashionsLogo from "./SRFashionsLogo";

const Footer = () => (
  <footer style={{ background: "var(--charcoal)", color: "var(--ivory)", paddingTop: 48 }}>
    <div className="container">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 36, paddingBottom: 40 }}>

        {/* Brand */}
        <div>
          <SRFashionsLogo linkTo={null} />
          <p style={{ marginTop: 16, color: "#aaa", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Your one-stop fashion destination for the entire family. From newborns to elders — we dress everyone with love and elegance.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <a href={`https://wa.me/917659983786`} target="_blank" rel="noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              💬 WhatsApp
            </a>
            <a href="tel:7659983786"
              style={{ background: "var(--crimson)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              📞 Call Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "var(--gold)", marginBottom: 16, fontSize: "1rem", letterSpacing: "1px" }}>QUICK LINKS</h4>
          {[
            { to: "/",            label: "Home" },
            { to: "/products",    label: "All Products" },
            { to: "/about",       label: "About Us" },
            { to: "/visit-shop",  label: "Visit Our Shop" },
            { to: "/contact",     label: "Contact Us" },
            { to: "/my-orders",   label: "My Orders" },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ display: "block", color: "#ccc", marginBottom: 8, fontSize: "0.9rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = "var(--gold)"}
              onMouseLeave={(e) => e.target.style.color = "#ccc"}
            >{label}</Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: "var(--gold)", marginBottom: 16, fontSize: "1rem", letterSpacing: "1px" }}>CATEGORIES</h4>
          {["Sarees","Mens Wear","Kids Wear","Wedding Collection","School Uniforms","Premium Collection","Home & Furnishings"].map((cat) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
              style={{ display: "block", color: "#ccc", marginBottom: 8, fontSize: "0.9rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = "var(--gold)"}
              onMouseLeave={(e) => e.target.style.color = "#ccc"}
            >{cat}</Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "var(--gold)", marginBottom: 16, fontSize: "1rem", letterSpacing: "1px" }}>CONTACT US</h4>
          <div style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 2 }}>
            <p>📍 SR Fashions, Near Water Plant</p>
            <p>Tempalli, Gannavaram Mandal</p>
            <p>Vijayawada, Krishna District</p>
            <p>Andhra Pradesh — 521286</p>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <a href="tel:7659983786" style={{ color: "#ccc", fontSize: "0.9rem" }}>📞 7659983786</a>
            <a href="mailto:srfashions@gmail.com" style={{ color: "#ccc", fontSize: "0.9rem" }}>✉️ srfashions@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

      {/* Bottom bar */}
      <div style={{ padding: "20px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <p style={{ color: "#888", fontSize: "0.82rem" }}>
          © {new Date().getFullYear()} SR Fashions, Tempalli. All rights reserved.
        </p>
        <p style={{ color: "#888", fontSize: "0.82rem" }}>
          Only Prepaid Orders &nbsp;|&nbsp; Powered by Razorpay 💳
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="mailto:srfashions@gmail.com" style={{ color: "#888", fontSize: "0.82rem" }}>Mail Us</a>
          <a href="tel:7659983786"              style={{ color: "#888", fontSize: "0.82rem" }}>Call Us</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
