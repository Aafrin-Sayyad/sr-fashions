
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { formatPrice, discountPct, getYouTubeId } from '../utils/helpers';
import { FiShoppingCart, FiPlayCircle, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selImg, setSelImg] = useState(0);
  const [selColor, setSelColor] = useState('');
  const [selSize, setSelSize] = useState('');
  const [selAddOns, setSelAddOns] = useState([]);
  const [qty, setQty] = useState(1);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data);
        setSelColor(r.data.colors?.[0]?.name || '');
        setSelSize(r.data.sizes?.[0] || '');
        if (r.data.category) {
          api.get(`/products?category=${r.data.category}&limit=6`).then(r2 => {
            setRelated(r2.data.products?.filter(p => p._id !== r.data._id).slice(0,4) || []);
          }).catch(() => {});
        }
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, qty, selColor, selSize, selAddOns);
    toast.success('Added to cart! 🛍️');
  };

  const toggleAddOn = (ao) => {
    setSelAddOns(prev =>
      prev.find(a => a.name === ao.name)
        ? prev.filter(a => a.name !== ao.name)
        : [...prev, ao]
    );
  };

  if (loading) return (
    <div className="loading-state" style={{padding:'80px', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px'}}>
      <div className="spinner"/>
      <p style={{fontFamily:'var(--font-serif)', color:'var(--text-mid)', fontSize:'18px'}}>Please wait...</p>
    </div>
  );
  if (!product) return null;

  const discount = discountPct(product.mrp, product.price);
  const ytId = getYouTubeId(product.youtubeVideoUrl || product.youtubeShortUrl);
  const allImages = product.images || [];
  const addOnTotal = selAddOns.reduce((s, a) => s + a.price, 0);

  return (
    <div className="detail-page page-container">
      <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft size={16}/> Back</button>

      <div className="detail-grid">
        {/* ── Images ── */}
        <div className="detail-images">
          <div className="main-image-wrap">
            {allImages[selImg] ? (
              <img src={allImages[selImg].url} alt={product.title} className="main-image"/>
            ) : (
              <div className="img-placeholder">No Image</div>
            )}
            {product.isSoldOut && (
              <div className="sold-out-overlay"><span className="sold-out-tag">SOLD OUT</span></div>
            )}
            {discount > 0 && !product.isSoldOut && (
              <span className="badge badge-red disc-badge">{discount}% OFF</span>
            )}
          </div>
          <div className="thumb-row">
            {allImages.map((img, i) => (
              <button key={i} className={`thumb-btn ${i === selImg ? 'active' : ''}`} onClick={() => setSelImg(i)}>
                <img src={img.url} alt={`View ${i+1}`}/>
              </button>
            ))}
          </div>
          {ytId && (
            <div className="video-section">
              {!showVideo ? (
                <button className="watch-btn" onClick={() => setShowVideo(true)}>
                  <FiPlayCircle size={22}/> Watch Product Video
                </button>
              ) : (
                <div className="yt-embed">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    title="Product Video" frameBorder="0" allowFullScreen
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="detail-info">
          <p className="detail-id">Product ID: <strong>{product.productId}</strong></p>
          {product.isPremium && <span className="badge badge-premium" style={{marginBottom:'10px',display:'inline-block'}}>★ Premium</span>}
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(product.price + addOnTotal)}</span>
            {product.mrp > product.price && (
              <>
                <span className="detail-mrp">{formatPrice(product.mrp)}</span>
                <span className="badge badge-red">{discount}% off</span>
              </>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="option-section">
              <p className="option-label">Colour: <strong>{selColor}</strong></p>
              <div className="color-options">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    className={`color-btn ${selColor === c.name ? 'selected' : ''}`}
                    style={{ '--swatch': c.hex || '#ccc' }}
                    onClick={() => setSelColor(c.name)}
                    title={c.name}
                  >
                    <span className="color-dot" style={{background: c.hex || '#ccc'}}/>
                    <span className="color-name">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="option-section">
              <p className="option-label">Size: <strong>{selSize}</strong></p>
              <div className="size-options">
                {product.sizes.map(s => (
                  <button key={s} className={`size-btn ${selSize === s ? 'selected' : ''}`}
                    onClick={() => setSelSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {product.addOns?.length > 0 && (
            <div className="option-section">
              <p className="option-label">Add-ons (Optional)</p>
              <div className="addon-options">
                {product.addOns.map((ao, i) => (
                  <label key={i} className={`addon-chip ${selAddOns.find(a=>a.name===ao.name) ? 'selected' : ''}`}>
                    <input type="checkbox" hidden checked={!!selAddOns.find(a=>a.name===ao.name)} onChange={() => toggleAddOn(ao)}/>
                    {ao.name} <span className="addon-price">+{formatPrice(ao.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="option-section">
            <p className="option-label">Quantity</p>
            <div className="qty-selector">
              <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q+1)}>+</button>
            </div>
          </div>

          {/* CTA */}
          <div className="detail-cta">
            <button className={`btn-gold cta-btn ${product.isSoldOut ? 'disabled' : ''}`}
              onClick={handleAddToCart} disabled={product.isSoldOut}>
              <FiShoppingCart size={18}/>
              {product.isSoldOut ? '😔 Sold Out' : 'Add to Cart'}
            </button>
            <button className="btn-outline cta-btn" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="detail-desc">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-meta">
            <span>Category: <strong>{product.category}</strong></span>
            {product.tags?.length > 0 && (
              <div className="tag-list">{product.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="related-section">
          <h2 className="section-title" style={{color:'var(--navy)', marginBottom:'20px'}}>More in {product.category}</h2>
          <div className="related-grid">
            {related.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        </section>
      )}

      <style>{`
        .detail-page { padding: 24px 20px 60px; }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; color: var(--navy); font-family: var(--font-serif);
          font-size: 14px; cursor: pointer; margin-bottom: 20px; padding: 6px 0;
          transition: var(--transition);
        }
        .back-btn:hover { color: var(--gold-dark); }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .main-image-wrap { position: relative; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 3/4; background: var(--cream-dark); }
        .main-image { width: 100%; height: 100%; object-fit: cover; }
        .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-light); }
        .disc-badge { position: absolute; top: 14px; left: 14px; font-size: 13px; padding: 5px 12px; }
        .thumb-row { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; }
        .thumb-btn { width: 72px; height: 72px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; cursor: pointer; flex-shrink: 0; transition: border-color 0.2s; }
        .thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-btn.active { border-color: var(--navy); }
        .watch-btn {
          width: 100%; margin-top: 12px; padding: 12px;
          border: 2px dashed var(--gold); border-radius: var(--radius);
          background: var(--cream); color: var(--navy);
          font-family: var(--font-serif); font-size: 15px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; transition: var(--transition);
        }
        .watch-btn:hover { background: var(--gold-light); }
        .yt-embed { margin-top: 12px; border-radius: var(--radius); overflow: hidden; aspect-ratio: 9/16; }
        .yt-embed iframe { width: 100%; height: 100%; }
        .detail-id { font-size: 12px; color: var(--text-light); margin-bottom: 6px; }
        .detail-title { font-size: 1.7rem; color: var(--navy); margin-bottom: 14px; line-height: 1.3; }
        .detail-price-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .detail-price { font-size: 1.8rem; font-weight: 700; font-family: var(--font-serif); color: var(--navy); }
        .detail-mrp { font-size: 1.1rem; color: var(--text-light); text-decoration: line-through; }
        .option-section { margin-bottom: 18px; }
        .option-label { font-size: 14px; color: var(--text-mid); margin-bottom: 8px; }
        .color-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .color-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 99px;
          border: 1.5px solid var(--gold-light); background: var(--white);
          cursor: pointer; transition: var(--transition); font-size: 13px;
        }
        .color-btn:hover, .color-btn.selected { border-color: var(--navy); background: var(--cream); }
        .color-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }
        .size-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .size-btn {
          padding: 8px 16px; border-radius: var(--radius);
          border: 1.5px solid var(--gold-light); background: var(--white);
          font-family: var(--font-serif); font-size: 14px; cursor: pointer; transition: var(--transition);
        }
        .size-btn:hover, .size-btn.selected { border-color: var(--navy); background: var(--navy); color: var(--white); }
        .addon-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .addon-chip {
          padding: 8px 14px; border-radius: 99px;
          border: 1.5px solid var(--gold-light); background: var(--white);
          font-size: 13px; cursor: pointer; transition: var(--transition);
          user-select: none;
        }
        .addon-chip:hover, .addon-chip.selected { border-color: var(--navy); background: var(--cream); }
        .addon-price { color: var(--gold-dark); font-weight: 600; margin-left: 4px; }
        .qty-selector { display: flex; align-items: center; gap: 0; }
        .qty-selector button {
          width: 36px; height: 36px; border: 1.5px solid var(--gold-light);
          background: var(--white); font-size: 18px; cursor: pointer;
          transition: var(--transition);
        }
        .qty-selector button:hover { background: var(--navy); color: var(--white); border-color: var(--navy); }
        .qty-selector button:first-child { border-radius: var(--radius) 0 0 var(--radius); }
        .qty-selector button:last-child  { border-radius: 0 var(--radius) var(--radius) 0; }
        .qty-selector span { width: 48px; height: 36px; display: flex; align-items: center; justify-content: center; border-top: 1.5px solid var(--gold-light); border-bottom: 1.5px solid var(--gold-light); font-family: var(--font-serif); font-size: 16px; }
        .detail-cta { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .cta-btn { flex: 1; min-width: 140px; padding: 14px 20px; font-size: 15px; justify-content: center; }
        .cta-btn.disabled { opacity: 0.5; cursor: not-allowed; }
        .detail-desc { background: var(--cream); border-radius: var(--radius); padding: 16px; margin-bottom: 16px; }
        .detail-desc h3 { font-family: var(--font-serif); color: var(--navy); margin-bottom: 8px; font-size: 15px; }
        .detail-desc p { font-size: 14px; color: var(--text-mid); line-height: 1.7; }
        .detail-meta { font-size: 13px; color: var(--text-light); }
        .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .tag-chip { background: var(--cream-dark); padding: 3px 10px; border-radius: 99px; font-size: 12px; color: var(--text-mid); }
        .related-section { margin-top: 48px; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; gap: 24px; }
          .yt-embed { aspect-ratio: 16/9; }
        }
      `}</style>
    </div>
  );
}
