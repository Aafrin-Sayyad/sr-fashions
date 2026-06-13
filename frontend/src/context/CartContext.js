import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('srf_cart') || '[]'); }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem('srf_cart', JSON.stringify(items)); }, [items]);

  const addToCart = (product, quantity = 1, color = '', size = '', addOns = []) => {
    const key = `${product._id}-${color}-${size}`;
    setItems(prev => {
      const exists = prev.find(i => i.key === key);
      if (exists) return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { key, product, quantity, color, size, addOns }];
    });
  };

  const removeFromCart = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const updateQty = (key, qty) => {
    if (qty <= 0) return removeFromCart(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = items.reduce((s, i) => {
    const addOnTotal = (i.addOns || []).reduce((a, ao) => a + ao.price, 0);
    return s + (i.product.price + addOnTotal) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
