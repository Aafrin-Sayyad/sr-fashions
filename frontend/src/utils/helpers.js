export const formatPrice = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
export const discountPct = (mrp, price) => mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
export const getYouTubeId = (url) => { if (!url) return null; const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([a-zA-Z0-9_-]{11})/); return m ? m[1] : null; };
export const truncate = (s, n) => s?.length > n ? s.slice(0, n) + '...' : s;
