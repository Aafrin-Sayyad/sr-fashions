// ============================================================
//  PAGE: ProductsPage — Browse all with sidebar filters
// ============================================================

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar      from "../components/common/Navbar";
import Footer      from "../components/common/Footer";
import ChatBox     from "../components/common/ChatBox";
import ProductCard from "../components/product/ProductCard";
import { motion } from "framer-motion";

const CATEGORIES = ["Sarees","Womens Wear","Mens Wear","Kids Wear","Wedding Collection","School Uniforms","Home & Furnishings","Innerwear & Nightwear","Premium Collection"];
const SORT_OPTIONS = [
  { label: "Newest First",    value: "-createdAt" },
  { label: "Price: Low-High", value: "discountPrice" },
  { label: "Price: High-Low", value: "-discountPrice" },
  { label: "Name A-Z",        value: "name" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);

  // Filter state
  const [category,  setCategory]  = useState(searchParams.get("category") || "");
  const [search,    setSearch]    = useState(searchParams.get("search")   || "");
  const [minPrice,  setMinPrice]  = useState("");
  const [maxPrice,  setMaxPrice]  = useState("");
  const [isPremium, setIsPremium] = useState(searchParams.get("isPremium") === "true");
  const [isNew,     setIsNew]     = useState(searchParams.get("isNewArrival") === "true");
  const [isFeatured,setIsFeatured]= useState(searchParams.get("isFeatured") === "true");
  const [sort,      setSort]      = useState("-createdAt");
  const [page,      setPage]      = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const LIMIT = 20;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (category)  params.set("category",    category);
      if (search)    params.set("search",       search);
      if (minPrice)  params.set("minPrice",     minPrice);
      if (maxPrice)  params.set("maxPrice",     maxPrice);
      if (isPremium) params.set("isPremium",    "true");
      if (isNew)     params.set("isNewArrival", "true");
      if (isFeatured)params.set("isFeatured",   "true");
      params.set("sort",  sort);
      params.set("page",  page);
      params.set("limit", LIMIT);

      try {
        const { data } = await axios.get(`/api/products?${params.toString()}`);
        setProducts(data.products);
        setTotal(data.pagination.total);
        setPages(data.pagination.pages);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [category, search, minPrice, maxPrice, isPremium, isNew, isFeatured, sort, page]);

  const clearFilters = () => {
    setCategory(""); setSearch(""); setMinPrice(""); setMaxPrice("");
    setIsPremium(false); setIsNew(false); setIsFeatured(false);
    setSort("-createdAt"); setPage(1);
  };

  const hasFilters = category || search || minPrice || maxPrice || isPremium || isNew || isFeatured;

  // ── Sidebar ──────────────────────────────────────────────
  const FilterPanel = () => (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ color: "var(--crimson)", fontSize: "1.05rem" }}>🔍 Filters</h3>
        {hasFilters && <button onClick={clearFilters} style={{ color: "var(--crimson)", background: "none", fontSize: "0.8rem", fontWeight: 600 }}>Clear All</button>}
      </div>

      {/* Category */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: "0.9rem", marginBottom: 10, color: "var(--charcoal)", borderBottom: "1px solid var(--gray-light)", paddingBottom: 6 }}>Category</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, fontWeight: !category ? 700 : 400, color: !category ? "var(--crimson)" : "var(--charcoal)" }}>
            <input type="radio" name="cat" checked={!category} onChange={() => setCategory("")} /> All Categories
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} style={{ cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, fontWeight: category === cat ? 700 : 400, color: category === cat ? "var(--crimson)" : "var(--charcoal)" }}>
              <input type="radio" name="cat" checked={category === cat} onChange={() => { setCategory(cat); setPage(1); }} /> {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: "0.9rem", marginBottom: 10, color: "var(--charcoal)", borderBottom: "1px solid var(--gray-light)", paddingBottom: 6 }}>Price Range (₹)</h4>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", outline: "none", fontSize: "0.85rem" }} />
          <span style={{ alignSelf: "center", color: "var(--gray)" }}>–</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", outline: "none", fontSize: "0.85rem" }} />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h4 style={{ fontSize: "0.9rem", marginBottom: 10, color: "var(--charcoal)", borderBottom: "1px solid var(--gray-light)", paddingBottom: 6 }}>Quick Filters</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "⭐ Premium",      val: isPremium,  set: setIsPremium },
            { label: "🆕 New Arrivals", val: isNew,      set: setIsNew     },
            { label: "✨ Featured",     val: isFeatured, set: setIsFeatured },
          ].map(({ label, val, set }) => (
            <label key={label} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: val ? "var(--crimson)" : "var(--charcoal)", fontWeight: val ? 700 : 400 }}>
              <input type="checkbox" checked={val} onChange={(e) => { set(e.target.checked); setPage(1); }} /> {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, var(--crimson-dark), var(--crimson))", padding: "32px 20px", textAlign: "center" }}>
        <h1 style={{ color: "var(--white)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
          {category || "All Products"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
          {total > 0 ? `${total} item${total !== 1 ? "s" : ""} found` : "Browse our collections"}
        </p>
      </div>

      <main className="container" style={{ flex: 1, padding: "32px 20px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>

        {/* Sidebar — hidden on mobile */}
        <aside style={{ position: "sticky", top: 80 }}>
          <FilterPanel />
        </aside>

        {/* Products */}
        <div>
          {/* Sort + count bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>{total} products</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: "0.9rem", color: "var(--gray)" }}>Sort:</label>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                style={{ padding: "8px 12px", border: "1px solid var(--gray-light)", borderRadius: "var(--radius)", fontFamily: "'Times New Roman', Times, serif", fontSize: "0.88rem", background: "var(--white)", cursor: "pointer" }}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div className="spinner" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "var(--crimson)", fontStyle: "italic", fontSize: "1.05rem" }}>Please wait, loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ color: "var(--crimson)", marginBottom: 8 }}>No products found</h3>
              <p style={{ color: "var(--gray)" }}>Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn-primary" style={{ marginTop: 20 }}>Clear Filters</button>
            </div>
          ) : (
            <motion.div
              key={`${category}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 }}
            >
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </motion.div>
          )}

          {/* Pagination */}
          {pages > 1 && !loading && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36, flexWrap: "wrap" }}>
              <button onClick={() => setPage(1)} disabled={page === 1} className="btn-outline" style={{ padding: "8px 14px" }}>«</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline" style={{ padding: "8px 16px" }}>← Prev</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = Math.max(1, Math.min(pages - 4, page - 2)) + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ padding: "8px 14px", borderRadius: "var(--radius)", fontWeight: page === p ? 700 : 400, background: page === p ? "var(--crimson)" : "var(--white)", color: page === p ? "var(--white)" : "var(--charcoal)", border: "2px solid var(--gray-light)", cursor: "pointer" }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-outline" style={{ padding: "8px 16px" }}>Next →</button>
              <button onClick={() => setPage(pages)} disabled={page === pages} className="btn-outline" style={{ padding: "8px 14px" }}>»</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ChatBox />
    </div>
  );
};

export default ProductsPage;
