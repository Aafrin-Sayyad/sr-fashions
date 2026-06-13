
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus } from 'react-icons/fi';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name:'', slug:'', icon:'', isPremium:false });

  const load = () => api.get('/admin/categories').then(r=>setCats(r.data)).catch(()=>{});
  useEffect(load, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try { await api.post('/admin/categories', form); toast.success('Category added'); setForm({name:'',slug:'',icon:'',isPremium:false}); load(); }
    catch (err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/admin/categories/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <h2 className="admin-page-title">Categories</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',alignItems:'start'}}>
        <div style={{background:'#fff',padding:'24px',borderRadius:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
          <h3 style={{marginBottom:'16px',color:'var(--navy)',fontFamily:'var(--font-serif)'}}>Add Category</h3>
          <form onSubmit={handleAdd}>
            {[{k:'name',l:'Name'},{k:'slug',l:'Slug (url-friendly)'},{k:'icon',l:'Emoji Icon'}].map(f=>(
              <div key={f.k} style={{marginBottom:'12px'}}>
                <label style={{display:'block',fontSize:'13px',color:'var(--text-mid)',marginBottom:'5px'}}>{f.l}</label>
                <input style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e0e0e0',borderRadius:'8px',fontSize:'14px',fontFamily:'var(--font-body)'}} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} required/>
              </div>
            ))}
            <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'14px',marginBottom:'16px',cursor:'pointer'}}>
              <input type="checkbox" checked={form.isPremium} onChange={e=>setForm(p=>({...p,isPremium:e.target.checked}))} style={{accentColor:'var(--navy)'}}/>
              Premium Category
            </label>
            <button type="submit" className="btn-primary"><FiPlus size={14}/> Add Category</button>
          </form>
        </div>
        <div style={{background:'#fff',padding:'24px',borderRadius:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
          <h3 style={{marginBottom:'16px',color:'var(--navy)',fontFamily:'var(--font-serif)'}}>All Categories</h3>
          {cats.map(c=>(
            <div key={c._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',border:'1px solid #f0f0f0',borderRadius:'8px',marginBottom:'8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontSize:'20px'}}>{c.icon}</span>
                <div><p style={{fontFamily:'var(--font-serif)',fontWeight:'600',color:'var(--navy)',fontSize:'14px'}}>{c.name}</p><p style={{fontSize:'11px',color:'var(--text-light)'}}>{c.slug}{c.isPremium?' • ⭐ Premium':''}</p></div>
              </div>
              <button onClick={()=>handleDelete(c._id)} style={{width:'32px',height:'32px',background:'none',border:'1px solid #e0e0e0',borderRadius:'6px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--red)',transition:'all 0.2s'}} onMouseEnter={e=>{e.target.style.background='var(--red)';e.target.style.color='#fff';}} onMouseLeave={e=>{e.target.style.background='none';e.target.style.color='var(--red)';}}>
                <FiTrash2 size={14}/>
              </button>
            </div>
          ))}
          {cats.length===0&&<p style={{color:'var(--text-light)',textAlign:'center',padding:'20px'}}>No categories yet</p>}
        </div>
      </div>
    </div>
  );
}
