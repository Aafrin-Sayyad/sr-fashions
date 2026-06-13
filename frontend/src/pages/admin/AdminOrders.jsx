
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['placed','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLOR = { placed:'#f59e0b', confirmed:'var(--navy)', processing:'#8b5cf6', shipped:'#0ea5e9', delivered:'var(--green)', cancelled:'var(--red)' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    const q = filterStatus ? `?status=${filterStatus}` : '';
    api.get(`/admin/orders${q}`).then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      load();
      setSelected(null);
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <h2 className="admin-page-title">Orders Management</h2>
        <select className="sort-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Orders</option>
          {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>
      {loading ? <div className="spinner" style={{margin:'40px auto'}}/> : (
        <div className="card" style={{overflowX:'auto'}}>
          <table className="orders-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} style={{cursor:'pointer'}} onClick={()=>setSelected(o)}>
                  <td><strong style={{fontFamily:'var(--font-serif)'}}>{o.orderId}</strong></td>
                  <td>{o.user?.name || '—'}</td>
                  <td>{o.shippingAddress?.phone}</td>
                  <td><strong>{formatPrice(o.total)}</strong></td>
                  <td><span className="status-chip" style={{background:STATUS_COLOR[o.orderStatus]+'22',color:STATUS_COLOR[o.orderStatus]}}>{o.orderStatus}</span></td>
                  <td><span className={`status-chip ${o.paymentStatus==='paid'?'delivered':''}`}>{o.paymentStatus}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <select className="sort-select" style={{fontSize:'12px',padding:'5px 8px'}} value={o.orderStatus}
                      onChange={e=>{e.stopPropagation();updateStatus(o._id,e.target.value)}}
                      onClick={e=>e.stopPropagation()}>
                      {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Order Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
            <div className="modal-header">
              <h3>Order: {selected.orderId}</h3>
              <button onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>
              <div className="detail-section">
                <h4>Customer & Delivery</h4>
                <p><strong>Name:</strong> {selected.shippingAddress?.fullName}</p>
                <p><strong>Phone:</strong> {selected.shippingAddress?.phone}</p>
                <p><strong>Email:</strong> {selected.user?.email || '—'}</p>
                <p><strong>Address:</strong> {selected.shippingAddress?.line1}, {selected.shippingAddress?.line2}, {selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}</p>
              </div>
              <div className="detail-section">
                <h4>Items Ordered</h4>
                {selected.items?.map((item,i)=>(
                  <div key={i} style={{display:'flex',gap:'10px',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--cream-dark)'}}>
                    {item.image && <img src={item.image} style={{width:40,height:48,objectFit:'cover',borderRadius:6}} alt=""/>}
                    <div style={{flex:1}}>
                      <p style={{fontSize:'13px',fontFamily:'var(--font-serif)',color:'var(--navy)'}}>{item.title}</p>
                      <p style={{fontSize:'12px',color:'var(--text-light)'}}>ID: {item.productId} | Qty: {item.quantity} {item.color&&`| ${item.color}`} {item.size&&`| ${item.size}`}</p>
                    </div>
                    <span style={{fontFamily:'var(--font-serif)',fontWeight:700,color:'var(--navy)'}}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-serif)',fontSize:'16px',fontWeight:700,color:'var(--navy)',paddingTop:'10px'}}>
                  <span>Total</span><span>{formatPrice(selected.total)}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {STATUSES.map(s=>(
                  <button key={s} className={`status-btn ${selected.orderStatus===s?'active':''}`} onClick={()=>updateStatus(selected._id,s)}
                    style={{padding:'7px 14px',borderRadius:99,border:`1.5px solid ${STATUS_COLOR[s]}`,background:selected.orderStatus===s?STATUS_COLOR[s]:'transparent',color:selected.orderStatus===s?'#fff':STATUS_COLOR[s],cursor:'pointer',fontSize:'12px',fontWeight:600}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .detail-section { background:var(--cream); border-radius:var(--radius); padding:14px; }
        .detail-section h4 { font-family:var(--font-serif); color:var(--navy); margin-bottom:8px; }
        .detail-section p { font-size:13px; color:var(--text-mid); margin-bottom:4px; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
        .modal-box { background:var(--white); border-radius:var(--radius-lg); width:100%; max-height:90vh; overflow-y:auto; }
        .modal-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--gold-light); }
        .modal-header h3 { font-family:var(--font-serif); color:var(--navy); }
        .modal-header button { background:none; border:none; cursor:pointer; font-size:18px; color:var(--text-mid); }
        .sort-select { padding:9px 14px; border:1.5px solid var(--gold-light); border-radius:var(--radius); font-family:var(--font-body); font-size:14px; background:var(--white); cursor:pointer; }
      `}</style>
    </div>
  );
}
