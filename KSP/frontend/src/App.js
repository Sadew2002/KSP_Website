import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PlaceOrder from './pages/PlaceOrder';
import Profile from './pages/Profile';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Orders from './pages/Orders';
import About from './pages/About';
import AdminDashboard from './pages/Admin/Dashboard';
import './styles/globals.css';

// Layout wrapper component
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navigation />}
      <main className={isAdminRoute ? '' : 'flex-grow'}>
        {children}
      </main>
      {!isAdminRoute && <Footer showNewsletter={isHomePage} />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/about" element={<About />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* 404 Route */}
          <Route path="*" element={<div className="text-center py-20">Page not found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
