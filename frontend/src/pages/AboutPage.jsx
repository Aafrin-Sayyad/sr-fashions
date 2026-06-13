
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiGift } from 'react-icons/fi';

const ITEMS = [
  { cat: 'Sarees', items: ['Pattu Sarees','Silk Sarees','Wedding Sarees','Fancy Sarees','Work Sarees','Design Sarees','All Types of Sarees'] },
  { cat: "Kids Wear", items: ['Newborn (1 month+)','Toddler Wear','Kids Dresses','School Uniforms','Kids Casual Wear'] },
  { cat: "Men's Wear", items: ['Formal Shirts','T-Shirts','Jeans','Shorts','Lungis','Panchelu','Innerwear','Towels'] },
  { cat: "Women's Wear", items: ['Tops','Leggings','Nighties','Night Pants','Innerwear','Dupattas','Readymade Dresses'] },
  { cat: 'Wedding Collection', items: ['Bridal Sarees','Wedding Dresses','Groom Wear','Family Wedding Sets'] },
  { cat: 'Home Textiles', items: ['Bed Sheets','Door Curtains','Towels','Navaarlu (Mats)'] },
  { cat: 'Suiting & Shirting', items: ['Suit Fabric','Shirt Fabric','Formal Fabric','Cotton Fabric'] },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="page-container">
          <img src="/logo.png" alt="SR Fashions" className="about-logo"/>
          <h1>About SR Fashions</h1>
          <p className="about-tagline">Your Complete Family Store — Apparel for Kids & The Entire Family</p>
        </div>
      </div>

      <div className="page-container">
        {/* Story */}
        <section className="about-section card">
          <h2>Our Story</h2>
          <p>SR Fashions is your trusted neighbourhood fashion destination in Tempalli, Gannavaram Mandal, Vijayawada. We serve every member of your family — from a 1-month-old baby to 90-year-old elders — with quality clothing, fabrics and home textiles at affordable prices.</p>
          <p>Our shop carries an extraordinary range: all types of sarees (pattu, silk, fancy, wedding, work, design), readymade dresses, kids wear, men's wear, women's wear, school uniforms, home textiles and much more. We also offer <strong>special gifts for our valued customers</strong>!</p>
        </section>

        {/* Product Grid */}
        <section className="products-offered">
          <h2 className="section-heading">What We Offer</h2>
          <div className="offer-grid">
            {ITEMS.map(g => (
              <div key={g.cat} className="offer-card card">
                <h3>{g.cat}</h3>
                <ul>
                  {g.items.map(i => <li key={i}>✓ {i}</li>)}
                </ul>
                <Link to={`/products?category=${g.cat.toLowerCase().replace(/ /g,'-')}`} className="browse-link">Browse →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers */}
        <section className="special-offer card">
          <FiGift size={40} style={{color:'var(--gold)', marginBottom:'12px'}}/>
          <h2>Special Gift Offers</h2>
          <p>SR Fashions values every customer. We offer <strong>exclusive special gifts</strong> with select purchases. Visit our store or shop online to find out about our current offers and promotions!</p>
          <Link to="/products" className="btn-gold" style={{marginTop:'16px', display:'inline-flex', alignItems:'center', gap:'8px'}}>Shop Now & Claim Offers</Link>
        </section>

        {/* Contact quick */}
        <section className="about-contact card">
          <h2>Find Us</h2>
          <div className="contact-items">
            <div className="contact-item"><FiMapPin size={20}/><div><strong>Address</strong><p>SR Fashions, near water plant, Tempalli, Gannavaram Mandal, Vijayawada, Krishna District, Andhra Pradesh - 521286</p></div></div>
            <div className="contact-item"><FiPhone size={20}/><div><strong>Phone</strong><a href="tel:7659983786">7659983786</a></div></div>
            <div className="contact-item"><FiMail size={20}/><div><strong>Email</strong><a href="mailto:dastagiris553@gmail.com">dastagiris553@gmail.com</a></div></div>
          </div>
          <Link to="/visit" className="btn-primary" style={{marginTop:'20px', display:'inline-flex', gap:'8px'}}>See Store Photos & Map</Link>
        </section>
      </div>

      <style>{`
        .about-hero { background: linear-gradient(135deg, var(--navy), var(--navy-light)); color: var(--white); padding: 60px 20px; text-align: center; }
        .about-logo { height: 80px; margin: 0 auto 20px; filter: brightness(0) invert(1); }
        .about-hero h1 { font-size: 2.2rem; margin-bottom: 10px; }
        .about-tagline { color: var(--gold-light); font-size: 16px; }
        .about-section { padding: 32px; margin: 32px 0; display: flex; flex-direction: column; gap: 14px; }
        .about-section h2 { color: var(--navy); font-size: 1.4rem; }
        .about-section p { color: var(--text-mid); font-size: 15px; line-height: 1.8; }
        .section-heading { color: var(--navy); font-size: 1.6rem; margin: 32px 0 20px; }
        .offer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .offer-card { padding: 20px 24px; }
        .offer-card h3 { font-family: var(--font-serif); color: var(--navy); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--gold-light); }
        .offer-card ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .offer-card ul li { font-size: 13px; color: var(--text-mid); }
        .browse-link { display: inline-block; margin-top: 12px; color: var(--navy); font-size: 13px; font-family: var(--font-serif); text-decoration: underline; }
        .special-offer { padding: 40px; text-align: center; margin-bottom: 24px; background: linear-gradient(135deg, var(--cream), var(--gold-light)); }
        .special-offer h2 { color: var(--navy); font-size: 1.4rem; margin-bottom: 12px; }
        .special-offer p { color: var(--text-mid); max-width: 600px; margin: 0 auto; font-size: 15px; }
        .about-contact { padding: 32px; margin-bottom: 40px; }
        .about-contact h2 { color: var(--navy); margin-bottom: 20px; }
        .contact-items { display: flex; flex-direction: column; gap: 16px; }
        .contact-item { display: flex; gap: 14px; align-items: flex-start; color: var(--navy); }
        .contact-item strong { display: block; margin-bottom: 4px; font-family: var(--font-serif); }
        .contact-item p, .contact-item a { color: var(--text-mid); font-size: 14px; }
        .contact-item a:hover { color: var(--navy); text-decoration: underline; }
      `}</style>
    </div>
  );
}
