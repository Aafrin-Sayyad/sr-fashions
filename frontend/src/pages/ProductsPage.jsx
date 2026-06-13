
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { FiFilter, FiChevronDown, FiX, FiLoader } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';

const CATEGORIES = [
  { slug: '', label: 'All Products' },
  { slug: 'sarees', label: 'Sarees' },
  { slug: 'kids-wear', label: 'Kids Wear' },
  { slug: 'mens-wear', label: "Men's Wear" },
  { slug: 'womens-wear', label: "Women's Wear" },
  { slug: 'wedding', label: 'Wedding Wear' },
  { slug: 'uniforms', label: 'School Uniforms' },
  { slug: 'innerwear', label: 'Innerwear' },
  { slug: 'home-textiles', label: 'Home Textiles' },
];

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const page = parseInt(params.get('page') || '1');

  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const isPremium = params.get('isPremium') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 20, sort });
      if (category) q.set('category', category);
      if (search) q.set('search', search);
      if (isPremium) q.set('isPremium', '1');
      if (minPrice) q.set('minPrice', minPrice);
      if (maxPrice) q.set('maxPrice', maxPrice);
      const r = await api.get(`/products?${q}`);
      setProducts(r.data.products || []);
      setTotal(r.data.total || 0);
      setPages(r.data.pages || 1);
    } catch {}
    finally { setLoading(false); }
  }, [page, category, search, isPremium, minPrice, maxPrice, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const applyFilter = () => { setParams(p => { p.set('page','1'); return p; }); fetchProducts(); setFilterOpen(false); };
  const clearFilters = () => { setMinPrice(''); setMaxPrice(''); setSort('newest'); };

  return (
    <div className="products-page page-container">
      {/* Top bar */}
      <div className="products-topbar">
        <div className="topbar-left">
          <h1 className="page-heading">
            {isPremium ? '★ Premium Collection' : search ? `Results for "${search}"` : category ? CATEGORIES.find(c=>c.slug===category)?.label || 'Products' : 'All Products'}
          </h1>
          <span className="total-count">{total} items</span>
        </div>
        <div className="topbar-right">
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
            <FiFilter size={16}/> Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-panel fade-in">
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input className="input-field" placeholder="Min ₹" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <span>—</span>
              <input className="input-field" placeholder="Max ₹" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-primary" onClick={applyFilter}>Apply</button>
            <button className="btn-outline" onClick={clearFilters}>Clear</button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(c => (
          <button
            key={c.slug}
            className={`cat-tab ${category === c.slug ? 'active' : ''}`}
            onClick={() => setParams(p => { c.slug ? p.set('category', c.slug) : p.delete('category'); p.set('page','1'); return p; })}
          >{c.label}</button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"/>
          <p className="loading-msg">Please wait...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state" style={{padding:'80px 20px', textAlign:'center'}}>
          <p style={{fontSize:'48px'}}>🔍</p>
          <h3 style={{marginTop:'16px', color:'var(--navy)'}}>No products found</h3>
          <p style={{color:'var(--text-light)', marginTop:'8px'}}>Try different filters or search terms</p>
        </div>
      ) : (
        <div className="product-grid-page">
          {products.map(p => <ProductCard key={p._id} product={p}/>)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          {Array.from({length: pages}, (_, i) => i+1).map(p => (
            <button key={p} className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => setParams(prev => { prev.set('page', p); return prev; })}>
              {p}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .products-page { padding-top: 28px; padding-bottom: 60px; }
        .products-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .topbar-left { display: flex; align-items: baseline; gap: 12px; }
        .page-heading { font-size: 1.6rem; color: var(--navy); }
        .total-count { color: var(--text-light); font-size: 14px; }
        .topbar-right { display: flex; gap: 10px; align-items: center; }
        .sort-select {
          padding: 9px 14px; border: 1.5px solid var(--gold-light);
          border-radius: var(--radius); font-family: var(--font-body); font-size: 14px;
          background: var(--white); color: var(--text-dark); cursor: pointer;
        }
        .filter-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; border: 1.5px solid var(--navy);
          border-radius: var(--radius); background: var(--white);
          color: var(--navy); font-size: 14px; font-family: var(--font-body);
          cursor: pointer; transition: var(--transition);
        }
        .filter-btn:hover { background: var(--navy); color: var(--white); }
        .filter-panel {
          background: var(--white); border: 1.5px solid var(--gold-light);
          border-radius: var(--radius-lg); padding: 20px 24px;
          margin-bottom: 20px; display: flex; gap: 24px; align-items: flex-end; flex-wrap: wrap;
        }
        .filter-group label { display: block; font-size: 13px; color: var(--text-light); margin-bottom: 8px; }
        .price-inputs { display: flex; align-items: center; gap: 8px; }
        .price-inputs .input-field { width: 120px; }
        .filter-actions { display: flex; gap: 8px; }
        .category-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 24px; scrollbar-width: none; }
        .category-tabs::-webkit-scrollbar { display: none; }
        .cat-tab {
          padding: 8px 18px; border-radius: 99px; white-space: nowrap;
          border: 1.5px solid var(--gold-light); background: var(--white);
          font-family: var(--font-serif); font-size: 13px; color: var(--text-mid);
          cursor: pointer; transition: var(--transition);
        }
        .cat-tab:hover, .cat-tab.active { background: var(--navy); color: var(--white); border-color: var(--navy); }
        .product-grid-page { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; }
        .loading-msg { font-family: var(--font-serif); color: var(--text-mid); font-size: 16px; }
        .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 40px; flex-wrap: wrap; }
        .page-btn {
          width: 40px; height: 40px; border-radius: var(--radius);
          border: 1.5px solid var(--gold-light); background: var(--white);
          font-family: var(--font-serif); cursor: pointer; transition: var(--transition);
          color: var(--text-dark);
        }
        .page-btn:hover, .page-btn.active { background: var(--navy); color: var(--white); border-color: var(--navy); }
        @media (max-width: 600px) {
          .product-grid-page { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>
    </div>
  );
}
