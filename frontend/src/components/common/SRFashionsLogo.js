// ============================================================
//  COMPONENT: SRFashionsLogo — Animated SVG logo
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SRFashionsLogo = ({ size = "normal", linkTo = "/" }) => {
  const isSmall = size === "small";
  const w = isSmall ? 140 : 180;
  const h = isSmall ? 48  : 60;

  const logo = (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}
    >
      {/* ── Icon Mark ── */}
      <motion.svg
        width={isSmall ? 38 : 48}
        height={isSmall ? 38 : 48}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ rotate: 5, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Outer circle */}
        <circle cx="24" cy="24" r="23" fill="#8B1A1A" stroke="#D4AF37" strokeWidth="2" />
        {/* Decorative inner ring */}
        <circle cx="24" cy="24" r="19" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 2" />
        {/* "SR" text */}
        <text
          x="24" y="21"
          textAnchor="middle"
          fill="#D4AF37"
          fontFamily="Times New Roman, serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="1"
        >SR</text>
        {/* Tagline */}
        <text
          x="24" y="32"
          textAnchor="middle"
          fill="#FAF6F0"
          fontFamily="Times New Roman, serif"
          fontWeight="400"
          fontSize="5.5"
          letterSpacing="1.2"
        >FASHIONS</text>
        {/* Bottom decorative dots */}
        <circle cx="16" cy="38" r="1.5" fill="#D4AF37" />
        <circle cx="24" cy="40" r="1.5" fill="#D4AF37" />
        <circle cx="32" cy="38" r="1.5" fill="#D4AF37" />
      </motion.svg>

      {/* ── Text Mark ── */}
      <div style={{ lineHeight: 1.15 }}>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: 700,
            fontSize: isSmall ? "1.05rem" : "1.35rem",
            color: "#8B1A1A",
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          SR Fashions
        </motion.div>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: isSmall ? "0.55rem" : "0.65rem",
            color: "#D4AF37",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Tempalli, Vijayawada
        </motion.div>
      </div>
    </motion.div>
  );

  if (!linkTo) return logo;
  return <Link to={linkTo} style={{ textDecoration: "none" }}>{logo}</Link>;
};

export default SRFashionsLogo;
