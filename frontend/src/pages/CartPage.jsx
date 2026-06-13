
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="empty-cart page-container">
      <FiShoppingCart size={64} style={{color:'var(--gold-light)', marginBottom:'16px'}}/>
      <h2>Your cart is empty</h2>
      <p>Add some beautiful outfits to your cart!</p>
      <Link to="/products" className="btn-primary" style={{marginTop:'20px'}}>Continue Shopping</Link>
      <style>{`
        .empty-cart { min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px; }
        .empty-cart h2 { color:var(--navy); margin-bottom:8px; }
        .empty-cart p { color:var(--text-light); }
      `}</style>
    </div>
  );

  return (
    <div className="cart-page page-container">
      <h1 className="cart-title">Shopping Cart ({totalItems} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.key} className="cart-item card">
              <img src={item.product.images?.[0]?.url || '/placeholder.jpg'} alt={item.product.title} className="cart-item-img"/>
              <div className="cart-item-info">
                <p className="cart-item-id">ID: {item.product.productId}</p>
                <h3 className="cart-item-name">{item.product.title}</h3>
                <div className="cart-item-meta">
                  {item.color && <span>Colour: <strong>{item.color}</strong></span>}
                  {item.size  && <span>Size: <strong>{item.size}</strong></span>}
                </div>
                {item.addOns?.length > 0 && (
                  <div className="cart-addons">{item.addOns.map(a => <span key={a.name} className="addon-tag">{a.name} +{formatPrice(a.price)}</span>)}</div>
                )}
                <div className="cart-item-bottom">
                  <div className="qty-selector">
                    <button onClick={() => updateQty(item.key, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.key, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-price">{formatPrice(item.product.price * item.quantity)}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item.key)}><FiTrash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary card">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal ({totalItems} items)</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong style={{color:'var(--green)'}}>Calculated at checkout</strong></div>
          </div>
          <div className="summary-total">
            <span>Total</span><strong>{formatPrice(subtotal)}</strong>
          </div>
          <p className="prepaid-note">💳 Prepaid only — Razorpay payment</p>
          {user ? (
            <button className="btn-gold checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <FiArrowRight/>
            </button>
          ) : (
            <Link to="/login" className="btn-primary checkout-btn">
              Login to Checkout <FiArrowRight/>
            </Link>
          )}
          <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
      <style>{`
        .cart-page { padding: 28px 20px 60px; }
        .cart-title { color: var(--navy); margin-bottom: 24px; font-size: 1.5rem; }
        .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .cart-items { display: flex; flex-direction: column; gap: 16px; }
        .cart-item { display: flex; gap: 16px; padding: 16px; }
        .cart-item-img { width: 100px; height: 120px; object-fit: cover; border-radius: var(--radius); flex-shrink: 0; }
        .cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .cart-item-id { font-size: 11px; color: var(--text-light); }
        .cart-item-name { font-family: var(--font-serif); color: var(--navy); font-size: 15px; }
        .cart-item-meta { display: flex; gap: 12px; font-size: 13px; color: var(--text-light); flex-wrap: wrap; }
        .cart-addons { display: flex; flex-wrap: wrap; gap: 6px; }
        .addon-tag { background: var(--cream-dark); font-size: 11px; padding: 2px 8px; border-radius: 99px; color: var(--text-mid); }
        .cart-item-bottom { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
        .qty-selector { display: flex; align-items: center; }
        .qty-selector button { width: 30px; height: 30px; border: 1.5px solid var(--gold-light); background: var(--white); cursor: pointer; font-size: 16px; transition: var(--transition); }
        .qty-selector button:first-child { border-radius: var(--radius) 0 0 var(--radius); }
        .qty-selector button:last-child  { border-radius: 0 var(--radius) var(--radius) 0; }
        .qty-selector button:hover { background: var(--navy); color: var(--white); }
        .qty-selector span { width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; border-top: 1.5px solid var(--gold-light); border-bottom: 1.5px solid var(--gold-light); font-weight: 600; }
        .cart-item-price { font-family: var(--font-serif); font-weight: 700; color: var(--navy); font-size: 16px; margin-left: auto; }
        .remove-btn { background: none; border: none; color: var(--red); cursor: pointer; padding: 4px; }
        .cart-summary { padding: 24px; }
        .summary-title { font-family: var(--font-serif); color: var(--navy); margin-bottom: 16px; font-size: 1.1rem; }
        .summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-mid); }
        .summary-total { display: flex; justify-content: space-between; font-size: 18px; font-family: var(--font-serif); color: var(--navy); padding: 14px 0; border-top: 1.5px solid var(--gold-light); border-bottom: 1.5px solid var(--gold-light); margin-bottom: 16px; }
        .prepaid-note { font-size: 12px; color: var(--text-light); margin-bottom: 14px; }
        .checkout-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-bottom: 12px; }
        .continue-shopping { display: block; text-align: center; font-size: 13px; color: var(--text-light); text-decoration: underline; }
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
