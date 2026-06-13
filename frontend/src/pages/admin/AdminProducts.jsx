
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiCheck } from 'react-icons/fi';

const CATS = ['sarees','kids-wear','mens-wear','womens-wear','wedding','uniforms','innerwear','home-textiles'];
const EMPTY = { productId:'', title:'', description:'', category:'sarees', price:'', mrp:'', discount:0, stock:10, isPremium:false, isSoldOut:false, youtubeShortUrl:'', youtubeVideoUrl:'', colors:[], sizes:[], addOns:[], tags:[], images:[] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [colorInput, setColorInput] = useState({ name:'', hex:'#000000' });
  const [addonInput, setAddonInput] = useState({ name:'', price:'' });

  const load = () => {
    setLoading(true);
    api.get('/products?limit=100').then(r => setProducts(r.data.products || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ ...p, price: p.price.toString(), mrp: p.mrp?.toString() || '' });
    setEditing(p._id); setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    try {
      const r = await api.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, images: [...prev.images, ...r.data] }));
      toast.success('Images uploaded!');
    } catch { toast.error('Upload failed'); }
  };

  const save = async () => {
    if (!form.productId || !form.title || !form.price) return toast.error('Fill required fields');
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp) || undefined };
      if (editing) { await api.put(`/products/${editing}`, payload); toast.success('Product updated!'); }
      else { await api.post('/products', payload); toast.success('Product added!'); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    await api.delete(`/products/${id}`); toast.success('Removed'); load();
  };

  return (
    <div className="admin-products">
      <div className="ap-header">
        <h2 className="admin-page-title">Products</h2>
        <button className="btn-primary" onClick={openAdd}><FiPlus/> Add Product</button>
      </div>

      {loading ? <div className="spinner" style={{margin:'40px auto'}}/> : (
        <div className="products-table-wrap card">
          <table className="orders-table">
            <thead><tr><th>Image</th><th>ID</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td><img src={p.images?.[0]?.url || '/placeholder.jpg'} style={{width:44,height:52,objectFit:'cover',borderRadius:6}} alt=""/></td>
                  <td style={{fontFamily:'var(--font-serif)',fontWeight:600}}>{p.productId}</td>
                  <td>{p.title}</td>
                  <td><span className="status-chip">{p.category}</span></td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.isSoldOut ? <span className="status-chip" style={{background:'#fdecea',color:'var(--red)'}}>Sold Out</span>
                     : p.isPremium ? <span className="status-chip badge-premium">Premium</span>
                     : <span className="status-chip" style={{background:'#eafaf1',color:'var(--green)'}}>Active</span>}
                  </td>
                  <td>
                    <button className="tbl-btn edit" onClick={() => openEdit(p)}><FiEdit2 size={15}/></button>
                    <button className="tbl-btn del" onClick={() => deleteProduct(p._id)}><FiTrash2 size={15}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)}><FiX size={20}/></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Product ID *</label><input className="input-field" placeholder="SRF-001" value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})}/></div>
                <div className="form-group"><label>Category *</label>
                  <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Product Title *</label><input className="input-field" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="form-group"><label>Description *</label><textarea className="input-field" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Price (₹) *</label><input className="input-field" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
                <div className="form-group"><label>MRP / Original Price (₹)</label><input className="input-field" type="number" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})}/></div>
                <div className="form-group"><label>Stock Qty</label><input className="input-field" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>YouTube Shorts URL</label><input className="input-field" placeholder="https://youtube.com/shorts/..." value={form.youtubeShortUrl} onChange={e=>setForm({...form,youtubeShortUrl:e.target.value})}/></div>
                <div className="form-group"><label>YouTube Video URL</label><input className="input-field" placeholder="https://youtu.be/..." value={form.youtubeVideoUrl} onChange={e=>setForm({...form,youtubeVideoUrl:e.target.value})}/></div>
              </div>
              <div className="form-row">
                <label className="toggle-label"><input type="checkbox" checked={form.isPremium} onChange={e=>setForm({...form,isPremium:e.target.checked})}/> ★ Premium Product</label>
                <label className="toggle-label"><input type="checkbox" checked={form.isSoldOut} onChange={e=>setForm({...form,isSoldOut:e.target.checked})}/> Mark as Sold Out</label>
              </div>
              {/* Images */}
              <div className="form-group">
                <label>Product Images</label>
                <label className="upload-btn"><FiUpload/> Upload Images<input type="file" multiple accept="image/*" hidden onChange={handleImageUpload}/></label>
                <div className="uploaded-imgs">
                  {form.images.map((img, i) => (
                    <div key={i} className="uploaded-thumb">
                      <img src={img.url} alt=""/>
                      <button onClick={() => setForm(prev => ({...prev, images: prev.images.filter((_,j)=>j!==i)}))}><FiX size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Colors */}
              <div className="form-group">
                <label>Colour Variants</label>
                <div className="addon-row">
                  <input className="input-field" placeholder="Color name" value={colorInput.name} onChange={e=>setColorInput({...colorInput,name:e.target.value})} style={{flex:1}}/>
                  <input type="color" value={colorInput.hex} onChange={e=>setColorInput({...colorInput,hex:e.target.value})} style={{width:40,height:40,border:'none',borderRadius:6,cursor:'pointer'}}/>
                  <button className="btn-primary" style={{padding:'8px 14px'}} onClick={()=>{if(colorInput.name){setForm(prev=>({...prev,colors:[...prev.colors,colorInput]}));setColorInput({name:'',hex:'#000000'});}}}>+</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
                  {form.colors.map((c,i)=>(
                    <span key={i} className="color-tag" style={{background:c.hex}}>
                      {c.name}
                      <button onClick={()=>setForm(prev=>({...prev,colors:prev.colors.filter((_,j)=>j!==i)}))}><FiX size={10}/></button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Add-ons */}
              <div className="form-group">
                <label>Add-ons</label>
                <div className="addon-row">
                  <input className="input-field" placeholder="Add-on name" value={addonInput.name} onChange={e=>setAddonInput({...addonInput,name:e.target.value})} style={{flex:1}}/>
                  <input className="input-field" type="number" placeholder="Price ₹" value={addonInput.price} onChange={e=>setAddonInput({...addonInput,price:e.target.value})} style={{width:90}}/>
                  <button className="btn-primary" style={{padding:'8px 14px'}} onClick={()=>{if(addonInput.name&&addonInput.price){setForm(prev=>({...prev,addOns:[...prev.addOns,{name:addonInput.name,price:Number(addonInput.price)}]}));setAddonInput({name:'',price:''});}}}>+</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
                  {form.addOns.map((a,i)=>(
                    <span key={i} className="addon-tag">
                      {a.name} +₹{a.price}
                      <button onClick={()=>setForm(prev=>({...prev,addOns:prev.addOns.filter((_,j)=>j!==i)}))}><FiX size={10}/></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : <><FiCheck/> {editing ? 'Update' : 'Add Product'}</>}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-products { }
        .ap-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
        .products-table-wrap { overflow-x:auto; }
        .tbl-btn { padding:6px; border:none; border-radius:6px; cursor:pointer; transition:var(--transition); margin-right:4px; }
        .tbl-btn.edit { background:var(--cream); color:var(--navy); }
        .tbl-btn.del  { background:#fdecea; color:var(--red); }
        .tbl-btn:hover { opacity:0.8; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:flex-start; justify-content:center; padding:20px; overflow-y:auto; }
        .modal-box { background:var(--white); border-radius:var(--radius-lg); width:100%; max-width:680px; margin:auto; }
        .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid var(--gold-light); }
        .modal-header h3 { font-family:var(--font-serif); color:var(--navy); }
        .modal-header button { background:none; border:none; cursor:pointer; color:var(--text-mid); }
        .modal-body { padding:24px; display:flex; flex-direction:column; gap:14px; max-height:70vh; overflow-y:auto; }
        .modal-footer { padding:16px 24px; border-top:1px solid var(--gold-light); display:flex; justify-content:flex-end; gap:10px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .form-group { display:flex; flex-direction:column; gap:5px; }
        .form-group label { font-size:12px; color:var(--text-mid); font-family:var(--font-serif); }
        .form-group textarea { resize:vertical; }
        .toggle-label { display:flex; align-items:center; gap:8px; font-size:14px; color:var(--text-mid); cursor:pointer; }
        .upload-btn { display:inline-flex; align-items:center; gap:8px; padding:9px 16px; border:1.5px dashed var(--gold); border-radius:var(--radius); cursor:pointer; color:var(--navy); font-size:13px; background:var(--cream); }
        .uploaded-imgs { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
        .uploaded-thumb { position:relative; width:60px; height:70px; }
        .uploaded-thumb img { width:100%; height:100%; object-fit:cover; border-radius:6px; }
        .uploaded-thumb button { position:absolute; top:-4px; right:-4px; background:var(--red); color:#fff; border:none; border-radius:50%; width:18px; height:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .addon-row { display:flex; gap:8px; align-items:center; }
        .color-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:99px; font-size:12px; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,0.4); }
        .color-tag button { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.8); }
        .addon-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:99px; background:var(--cream-dark); font-size:12px; color:var(--text-mid); }
        .addon-tag button { background:none; border:none; cursor:pointer; color:var(--red); }
        @media (max-width:600px) { .form-row { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
