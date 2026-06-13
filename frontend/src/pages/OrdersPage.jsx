
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';

const STATUS_COLOR = { placed:'var(--gold)', confirmed:'var(--navy)', processing:'#8b5cf6', shipped:'#0ea5e9', delivered:'var(--green)', cancelled:'var(--red)' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state" style={{padding:'80px',display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}><div className="spinner"/><p style={{fontFamily:'var(--font-serif)'}}>Loading orders...</p></div>;

  return (
    <div className="orders-page page-container">
      <h1 className="orders-title">My Orders</h1>
      {orders.length === 0 ? (
        <div style={{textAlign:'center', padding:'60px'}}>
          <p style={{fontSize:'48px', marginBottom:'16px'}}>📦</p>
          <h3 style={{color:'var(--navy)'}}>No orders yet</h3>
          <p style={{color:'var(--text-light)', marginBottom:'20px'}}>Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order ID: <strong>{order.orderId}</strong></p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className="order-status badge" style={{background:`${STATUS_COLOR[order.orderStatus]}22`, color:STATUS_COLOR[order.orderStatus]}}>
                    {order.orderStatus.toUpperCase()}
                  </span>
                  <p className="order-total">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="order-items-preview">
                {order.items?.slice(0,3).map((item, i) => (
                  <div key={i} className="order-item-preview">
                    {item.image && <img src={item.image} alt={item.title}/>}
                    <span>{item.title} × {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div>
                  <p style={{fontSize:'13px',color:'var(--text-light)'}}>
                    📍 {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                  </p>
                </div>
                <span className={`pay-badge ${order.paymentStatus}`}>{order.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .orders-page { padding: 28px 20px 60px; }
        .orders-title { color: var(--navy); font-size: 1.8rem; margin-bottom: 24px; }
        .orders-list { display: flex; flex-direction: column; gap: 16px; }
        .order-card { padding: 20px 24px; }
        .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .order-id { font-family: var(--font-serif); color: var(--navy); font-size: 15px; }
        .order-date { font-size: 12px; color: var(--text-light); margin-top: 3px; }
        .order-status { font-size: 11px; padding: 4px 10px; margin-bottom: 4px; display: inline-block; }
        .order-total { font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--navy); }
        .order-items-preview { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--gold-light); }
        .order-item-preview { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-mid); }
        .order-item-preview img { width: 32px; height: 36px; object-fit: cover; border-radius: 4px; }
        .order-footer { display: flex; justify-content: space-between; align-items: center; }
        .pay-badge { font-size: 11px; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; font-weight: 600; background: var(--cream-dark); color: var(--text-mid); }
        .pay-badge.paid { background: #eafaf1; color: var(--green); }
      `}</style>
    </div>
  );
}
