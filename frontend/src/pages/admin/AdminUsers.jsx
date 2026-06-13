
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => { api.get('/admin/users').then(r=>setUsers(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const viewOrders = async (user) => {
    setSelectedUser(user);
    const r = await api.get(`/admin/users/${user._id}/orders`);
    setUserOrders(r.data);
  };

  return (
    <div>
      <h2 className="admin-page-title">Customers ({users.length})</h2>
      {loading ? <div style={{display:'flex',justifyContent:'center',padding:'40px'}}><div className="spinner"/></div> : (
        <div style={{display:'grid',gridTemplateColumns:selectedUser?'1fr 1fr':'1fr',gap:'20px',alignItems:'start'}}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Contact</th><th>Joined</th><th>Orders</th></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u._id} style={{cursor:'pointer',background:selectedUser?._id===u._id?'var(--cream)':'inherit'}} onClick={()=>viewOrders(u)}>
                    <td style={{fontFamily:'var(--font-serif)',fontWeight:'600'}}>{u.name}</td>
                    <td style={{fontSize:'13px',color:'var(--text-mid)'}}>{u.email||u.phone}</td>
                    <td style={{fontSize:'12px',color:'var(--text-light)'}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><button style={{padding:'4px 12px',background:'var(--navy)',color:'#fff',border:'none',borderRadius:'99px',fontSize:'12px',cursor:'pointer'}}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedUser && (
            <div style={{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                <h3 style={{fontFamily:'var(--font-serif)',color:'var(--navy)'}}>Orders by {selectedUser.name}</h3>
                <button onClick={()=>setSelectedUser(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'var(--text-light)'}}>×</button>
              </div>
              {userOrders.length===0?<p style={{color:'var(--text-light)',textAlign:'center',padding:'20px'}}>No orders yet</p>:
                userOrders.map(o=>(
                  <div key={o._id} style={{padding:'12px',border:'1px solid #eee',borderRadius:'8px',marginBottom:'8px'}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontFamily:'var(--font-serif)',fontWeight:'600',fontSize:'14px'}}>#{o.orderId}</span>
                      <span style={{fontWeight:'700',color:'var(--navy)',fontFamily:'var(--font-serif)'}}>₹{o.total?.toLocaleString()}</span>
                    </div>
                    <p style={{fontSize:'12px',color:'var(--text-light)',marginTop:'4px'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')} • {o.orderStatus}</p>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
