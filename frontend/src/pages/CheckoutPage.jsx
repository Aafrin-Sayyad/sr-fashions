
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiLock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const DUMMY_QR = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=srfashions@upi&pn=SR+Fashions';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('address'); // address | payment | success
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [addr, setAddr] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    line1: '', line2: '', city: '', state: 'Andhra Pradesh', pincode: ''
  });

  const handleAddrSubmit = (e) => {
    e.preventDefault();
    if (!addr.fullName || !addr.phone || !addr.line1 || !addr.city || !addr.pincode)
      return toast.error('Please fill all required fields');
    setStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order in DB
      const orderData = {
        items: items.map(i => ({
          product: i.product._id, productId: i.product.productId,
          title: i.product.title, image: i.product.images?.[0]?.url,
          price: i.product.price, quantity: i.quantity,
          color: i.color, size: i.size, addOns: i.addOns
        })),
        shippingAddress: addr,
        subtotal, total: subtotal,
        paymentMethod: 'razorpay'
      };

      const orderRes = await api.post('/orders', orderData);
      const order = orderRes.data;

      // Create payment order
      const payRes = await api.post('/payment/create-order', { amount: subtotal });

      if (payRes.data.mode === 'dummy') {
        // Dummy payment mode
        await api.post('/payment/verify', {
          razorpayOrderId: payRes.data.orderId,
          razorpayPaymentId: 'dummy_pay_' + Date.now(),
          razorpaySignature: 'dummy',
          orderId: order._id
        });
        setOrderId(order.orderId);
        clearCart();
        setStep('success');
      } else {
        // Live Razorpay
        const options = {
          key: payRes.data.key,
          amount: payRes.data.amount * 100,
          currency: 'INR',
          name: 'SR Fashions',
          description: 'Your Complete Family Store',
          order_id: payRes.data.orderId,
          handler: async (response) => {
            await api.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id
            });
            setOrderId(order.orderId);
            clearCart();
            setStep('success');
          },
          prefill: { name: addr.fullName, contact: addr.phone },
          theme: { color: '#1a3a5c' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Try again.');
    } finally { setLoading(false); }
  };

  if (step === 'success') return (
    <div className="success-page">
      <div className="success-card card">
        <FiCheckCircle size={64} style={{color:'var(--green)'}}/>
        <h2>Order Placed Successfully!</h2>
        <p>Your Order ID: <strong style={{color:'var(--navy)'}}>{orderId}</strong></p>
        <p style={{color:'var(--text-light)', fontSize:'14px', marginTop:'8px'}}>
          You will receive a WhatsApp confirmation on your phone shortly.
        </p>
        <div style={{display:'flex', gap:'12px', marginTop:'24px', flexWrap:'wrap', justifyContent:'center'}}>
          <button className="btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
          <button className="btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
      <style>{`.success-page{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;}.success-card{padding:40px;text-align:center;max-width:480px;display:flex;flex-direction:column;align-items:center;gap:12px;}h2{color:var(--navy);}`}</style>
    </div>
  );

  return (
    <div className="checkout-page page-container">
      <div className="checkout-steps">
        {['Address','Payment','Done'].map((s, i) => (
          <div key={s} className={`chk-step ${i === (step==='address'?0:step==='payment'?1:2) ? 'active' : i < (step==='address'?0:step==='payment'?1:2) ? 'done' : ''}`}>
            <span className="step-num">{i+1}</span> {s}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 'address' && (
            <div className="card checkout-card">
              <h2 className="chk-section-title">Delivery Address</h2>
              <form onSubmit={handleAddrSubmit} className="addr-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input className="input-field" value={addr.fullName} onChange={e => setAddr({...addr, fullName:e.target.value})} required/>
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input className="input-field" type="tel" value={addr.phone} onChange={e => setAddr({...addr, phone:e.target.value})} required/>
                  </div>
                </div>
                <div className="form-group">
                  <label>Address Line 1 *</label>
                  <input className="input-field" placeholder="House No, Street, Area" value={addr.line1} onChange={e => setAddr({...addr, line1:e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input className="input-field" placeholder="Landmark (Optional)" value={addr.line2} onChange={e => setAddr({...addr, line2:e.target.value})}/>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input className="input-field" value={addr.city} onChange={e => setAddr({...addr, city:e.target.value})} required/>
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input className="input-field" value={addr.pincode} onChange={e => setAddr({...addr, pincode:e.target.value})} required maxLength={6}/>
                  </div>
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="input-field" value={addr.state} onChange={e => setAddr({...addr, state:e.target.value})}/>
                </div>
                <button type="submit" className="btn-primary chk-next-btn">Continue to Payment</button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="card checkout-card">
              <h2 className="chk-section-title"><FiLock size={18}/> Secure Payment</h2>
              <div className="payment-info">
                <p className="prepaid-label">💳 Prepaid Only — UPI / Card / Net Banking</p>
                <div className="qr-section">
                  <p style={{marginBottom:'12px', color:'var(--text-mid)', fontSize:'14px'}}>Scan & Pay with any UPI app:</p>
                  <img src={DUMMY_QR} alt="Payment QR" className="qr-img"/>
                  <p className="upi-id">UPI ID: <strong>srfashions@upi</strong></p>
                  <p style={{fontSize:'12px', color:'var(--text-light)', marginTop:'6px'}}>After live deployment, Razorpay QR will appear here automatically</p>
                </div>
              </div>
              <div className="payment-actions">
                <button className="btn-gold chk-next-btn" onClick={handlePayment} disabled={loading}>
                  <FiCreditCard size={18}/>
                  {loading ? 'Processing...' : `Pay ${formatPrice(subtotal)}`}
                </button>
                <button className="btn-outline" style={{marginTop:'8px', width:'100%'}} onClick={() => setStep('address')}>← Back to Address</button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="checkout-summary card">
          <h3 style={{fontFamily:'var(--font-serif)', color:'var(--navy)', marginBottom:'16px'}}>Order Summary</h3>
          <div className="order-items-list">
            {items.map(item => (
              <div key={item.key} className="chk-item">
                <img src={item.product.images?.[0]?.url||'/placeholder.jpg'} alt={item.product.title} className="chk-item-img"/>
                <div className="chk-item-info">
                  <p className="chk-item-name">{item.product.title}</p>
                  <p className="chk-item-meta">
                    {item.color && `${item.color} · `}{item.size && `${item.size} · `}Qty: {item.quantity}
                  </p>
                </div>
                <span className="chk-item-price">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="chk-total-row">
            <span>Total Amount</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page { padding: 28px 20px 60px; }
        .checkout-steps { display: flex; gap: 0; margin-bottom: 28px; }
        .chk-step { display: flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 14px; font-family: var(--font-serif); color: var(--text-light); border-bottom: 2px solid var(--gold-light); flex: 1; }
        .chk-step.active { color: var(--navy); border-bottom-color: var(--navy); font-weight: 600; }
        .chk-step.done { color: var(--green); border-bottom-color: var(--green); }
        .step-num { width: 24px; height: 24px; border-radius: 50%; background: var(--gold-light); color: var(--navy); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
        .chk-step.active .step-num { background: var(--navy); color: var(--white); }
        .checkout-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .checkout-card { padding: 28px; }
        .chk-section-title { font-family: var(--font-serif); color: var(--navy); margin-bottom: 20px; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; }
        .addr-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; color: var(--text-mid); }
        .chk-next-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-top: 8px; }
        .payment-info { margin-bottom: 20px; }
        .prepaid-label { background: var(--cream); padding: 12px 16px; border-radius: var(--radius); font-size: 14px; color: var(--navy); margin-bottom: 16px; }
        .qr-section { text-align: center; padding: 20px; background: var(--cream); border-radius: var(--radius); }
        .qr-img { width: 180px; height: 180px; margin: 0 auto 12px; border-radius: var(--radius); border: 3px solid var(--gold-light); }
        .upi-id { font-family: var(--font-serif); font-size: 16px; color: var(--navy); }
        .checkout-summary { padding: 24px; }
        .order-items-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .chk-item { display: flex; gap: 10px; align-items: center; }
        .chk-item-img { width: 52px; height: 60px; object-fit: cover; border-radius: 6px; }
        .chk-item-info { flex: 1; }
        .chk-item-name { font-size: 13px; font-family: var(--font-serif); color: var(--navy); line-height: 1.3; }
        .chk-item-meta { font-size: 11px; color: var(--text-light); margin-top: 2px; }
        .chk-item-price { font-weight: 700; font-family: var(--font-serif); color: var(--navy); font-size: 14px; }
        .chk-total-row { display: flex; justify-content: space-between; padding-top: 14px; border-top: 1.5px solid var(--gold-light); font-family: var(--font-serif); font-size: 16px; color: var(--navy); }
        @media (max-width: 768px) {
          .checkout-layout { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
