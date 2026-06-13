// ============================================================
//  COMPONENT: ProductCard
//  Flipkart/Amazon style card with colours, discount badge
// ============================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [selectedColour, setSelectedColour] = useState(
    product.colourVariants?.[0]?.colourName || ""
  );

  const price        = product.discountPrice || product.price;
  const hasDiscount  = product.discountPrice && product.discountPrice < product.price;
  const mainImage    = product.images?.[0] || "/placeholder.jpg";
  const hoverImage   = product.images?.[1] || mainImage;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "visible" }}
    >
      {/* ── Image ── */}
      <Link to={`/products/${product._id}`} style={{ display: "block", position: "relative", overflow: "hidden", height: 240 }}>
        <img
          src={hovered && hoverImage !== mainImage ? hoverImage : mainImage}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {product.isPremium   && <span className="badge-premium">⭐ Premium</span>}
          {product.isNewArrival && <span className="badge-new">New</span>}
          {hasDiscount         && <span className="discount-tag">{product.discountPercent}% OFF</span>}
        </div>

        {product.isSoldOut && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="badge-soldout" style={{ fontSize: "1rem", padding: "8px 20px" }}>SOLD OUT</span>
          </div>
        )}

        {/* Quick add-to-cart on hover */}
        {!product.isSoldOut && hovered && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => { e.preventDefault(); addToCart(product._id, selectedColour); }}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--crimson)", color: "var(--white)", padding: "10px", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            🛒 Add to Cart
          </motion.button>
        )}
      </Link>

      {/* ── Info ── */}
      <div style={{ padding: "12px 14px 14px" }}>
        <Link to={`/products/${product._id}`}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 4, color: "var(--charcoal)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginBottom: 6 }}>
          {product.category} {product.subCategory ? `· ${product.subCategory}` : ""}
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <span className="price-sale">₹{price.toLocaleString("en-IN")}</span>
          {hasDiscount && (
            <>
              <span className="price-original">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="discount-tag">{product.discountPercent}% off</span>
            </>
          )}
        </div>

        {/* Product ID */}
        <div style={{ fontSize: "0.7rem", color: "var(--gray)", fontFamily: "monospace", marginBottom: 8 }}>
          ID: {product.productId}
        </div>

        {/* Colour swatches */}
        {product.colourVariants?.length > 0 && (
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--gray)", marginBottom: 4 }}>Colours:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {product.colourVariants.slice(0, 6).map((cv) => (
                <button
                  key={cv.colourName}
                  title={cv.colourName}
                  onClick={(e) => { e.preventDefault(); setSelectedColour(cv.colourName); }}
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: cv.colourHex || "#ccc",
                    border: selectedColour === cv.colourName ? "2px solid var(--crimson)" : "2px solid var(--gray-light)",
                    cursor: "pointer", padding: 0,
                    boxShadow: selectedColour === cv.colourName ? "0 0 0 2px var(--ivory), 0 0 0 4px var(--crimson)" : "none",
                    transition: "all 0.2s",
                  }}
                />
              ))}
              {product.colourVariants.length > 6 && (
                <span style={{ fontSize: "0.7rem", color: "var(--gray)", alignSelf: "center" }}>+{product.colourVariants.length - 6}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
