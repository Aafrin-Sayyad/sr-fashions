
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, discountPct } from '../utils/helpers';
import { FiShoppingCart, FiPlayCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = discountPct(product.mrp, product.price);
  const mainImage = product.images?.[0]?.url || '/placeholder.jpg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.isSoldOut) return;
    addToCart(product, 1);
    toast.success(`${product.title} added to cart!`, { icon: '🛍️' });
  };

  return (
    <Link to={`/products/${product.productId || product._id}`} className="product-card-link">
      <div className="product-card card">
        {/* Image area */}
        <div className="product-img-wrap">
          <img src={mainImage} alt={product.title} loading="lazy" className="product-img" />
          {product.isSoldOut && (
            <div className="sold-out-overlay"><span className="sold-out-tag">SOLD OUT</span></div>
          )}
          {discount > 0 && !product.isSoldOut && (
            <span className="discount-badge badge badge-red">{discount}% OFF</span>
          )}
          {product.isPremium && (
            <span className="premium-badge badge badge-premium">★ Premium</span>
          )}
          {product.youtubeShortUrl && (
            <div className="yt-indicator"><FiPlayCircle size={16} /> Video</div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <p className="product-id">ID: {product.productId}</p>
          <h3 className="product-title">{product.title}</h3>
          <div className="product-price-row">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <span className="price-mrp">{formatPrice(product.mrp)}</span>
            )}
          </div>
          {/* Color swatches */}
          {product.colors?.length > 0 && (
            <div className="color-swatches">
              {product.colors.slice(0, 5).map((c, i) => (
                <span key={i} className="swatch" style={{ background: c.hex || '#ccc' }} title={c.name} />
              ))}
              {product.colors.length > 5 && <span className="swatch-more">+{product.colors.length - 5}</span>}
            </div>
          )}
          <button
            className={`add-to-cart-btn ${product.isSoldOut ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.isSoldOut}
          >
            <FiShoppingCart size={16} />
            {product.isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <style>{`
        .product-card-link { display: block; }
        .product-card { cursor: pointer; }
        .product-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; background: var(--cream-dark); }
        .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .product-card:hover .product-img { transform: scale(1.06); }
        .discount-badge { position: absolute; top: 10px; left: 10px; }
        .premium-badge { position: absolute; top: 10px; right: 10px; }
        .yt-indicator {
          position: absolute; bottom: 10px; right: 10px;
          background: rgba(0,0,0,0.7); color: #fff;
          font-size: 11px; padding: 4px 8px; border-radius: 4px;
          display: flex; align-items: center; gap: 4px;
        }
        .product-info { padding: 12px 14px 14px; }
        .product-id { font-size: 11px; color: var(--text-light); letter-spacing: 0.5px; margin-bottom: 4px; }
        .product-title {
          font-family: var(--font-serif); font-size: 15px; font-weight: 600;
          color: var(--text-dark); line-height: 1.4; margin-bottom: 8px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .product-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
        .price-current { font-family: var(--font-serif); font-size: 17px; font-weight: 700; color: var(--navy); }
        .price-mrp { font-size: 13px; color: var(--text-light); text-decoration: line-through; }
        .color-swatches { display: flex; gap: 5px; align-items: center; margin-bottom: 10px; }
        .swatch { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.15); }
        .swatch-more { font-size: 11px; color: var(--text-light); }
        .add-to-cart-btn {
          width: 100%; padding: 9px; border-radius: var(--radius);
          background: var(--navy); color: var(--white);
          font-family: var(--font-serif); font-size: 13px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: var(--transition); border: none; cursor: pointer;
        }
        .add-to-cart-btn:hover:not(.disabled) { background: var(--gold); color: var(--navy); }
        .add-to-cart-btn.disabled { background: #ccc; color: #888; cursor: not-allowed; }
      `}</style>
    </Link>
  );
}
