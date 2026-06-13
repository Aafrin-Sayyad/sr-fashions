
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBox from './components/ChatBox';
import OfflinePage from './components/OfflinePage';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VisitPage from './pages/VisitPage';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}><div className="spinner"/></div>;
  return user ? children : <Navigate to="/login"/>;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}><div className="spinner"/></div>;
  return user?.role === 'admin' ? children : <Navigate to="/admin/login"/>;
}

function AppContent() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOnline  = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  if (offline) return <OfflinePage/>;

  return (
    <Routes>
      {/* Admin routes — no Navbar/Footer */}
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/admin/*" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>

      {/* Customer routes */}
      <Route path="/*" element={
        <>
          <Navbar/>
          <main style={{minHeight:'60vh'}}>
            <Routes>
              <Route path="/"          element={<HomePage/>}/>
              <Route path="/products"  element={<ProductsPage/>}/>
              <Route path="/products/:id" element={<ProductDetailPage/>}/>
              <Route path="/login"     element={<LoginPage/>}/>
              <Route path="/cart"      element={<CartPage/>}/>
              <Route path="/about"     element={<AboutPage/>}/>
              <Route path="/contact"   element={<ContactPage/>}/>
              <Route path="/visit"     element={<VisitPage/>}/>
              <Route path="/checkout"  element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>}/>
              <Route path="/orders"    element={<ProtectedRoute><OrdersPage/></ProtectedRoute>}/>
              <Route path="*"          element={<Navigate to="/"/>}/>
            </Routes>
          </main>
          <Footer/>
          <ChatBox/>
        </>
      }/>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'Times New Roman', serif", background: '#1a3a5c', color: '#fff' } }}/>
          <AppContent/>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
