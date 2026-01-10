import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Box,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Upload,
  Save,
  AlertCircle,
  RefreshCw,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [settingsTab, setSettingsTab] = useState('store');
  
  // About Us form state
  const [aboutForm, setAboutForm] = useState({
    storeName: 'Kandy Super Phone',
    tagline: 'Your Trusted Mobile Partner Since 2015',
    description: 'Kandy Super Phone is the leading mobile phone retailer in Kandy, Sri Lanka. We are authorized dealers for all major brands including Apple, Samsung, Xiaomi, and more. Our commitment to quality and customer satisfaction has made us the go-to destination for all your mobile needs.',
    mission: 'To provide our customers with genuine, high-quality mobile devices at competitive prices, backed by exceptional after-sales service and support.',
    vision: 'To be the most trusted and preferred mobile retail destination in Sri Lanka, known for authenticity, variety, and customer care.',
    address: 'No. 123, Dalada Veediya, Kandy, Sri Lanka',
    phone: '+94 81 234 5678',
    email: 'info@kandysuperphone.lk',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
    yearsInBusiness: '10+',
    happyCustomers: '50,000+',
    brandsAvailable: '25+',
    warrantySupport: '100%'
  });

  // Load About Us data on mount
  useEffect(() => {
    const savedAboutData = localStorage.getItem('aboutUsData');
    if (savedAboutData) {
      setAboutForm(JSON.parse(savedAboutData));
    }
  }, []);

  // Save About Us data
  const handleSaveAboutUs = () => {
    localStorage.setItem('aboutUsData', JSON.stringify(aboutForm));
    setSuccess('About Us content saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '', description: '', brand: '', price: '', storage: '128GB',
    condition: 'Brand New', color: '', ram: '8GB', quantity: 0, imageUrl: '', sku: '', isNewArrival: false, isPremiumDeal: false
  });

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, JPG, PNG and WebP are allowed.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if product name is filled
    if (!productForm.name || productForm.name.trim() === '') {
      setError('Please enter the product name first before uploading an image.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploadingImage(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('productName', productForm.name);
      
      console.log('📤 Uploading image:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB');
      
      const response = await api.post('/upload/product-image', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 second timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        }
      });
      
      console.log('✅ Upload response:', response.data);
      
      if (response.data.success) {
        setProductForm(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
        setSuccess('Image uploaded successfully! URL: ' + response.data.imageUrl);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error uploading image';
      setError(errorMsg);
      setImagePreview(null);
      setTimeout(() => setError(''), 5000);
    } finally {
      setUploadingImage(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      navigate('/login', { state: { message: 'Please login as admin to access the dashboard' } });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Fetch products from database
  const fetchProducts = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await api.get('/admin/products', { params: { search: searchTerm } });
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 401) {
        navigate('/login', { state: { message: 'Session expired. Please login again.' } });
        return;
      }
      // Fallback to public endpoint if admin fails
      try {
        const publicResponse = await api.get('/products');
        setProducts(publicResponse.data.products || []);
      } catch (e) {
        setError('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Create product
  const handleCreateProduct = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!productForm.name || !productForm.brand || !productForm.price || !productForm.sku) {
      setError('Please fill in all required fields: Name, Brand, Price, and SKU');
      return;
    }
    
    setLoading(true);
    try {
      const dataToSend = {
        ...productForm,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity) || 0
      };
      console.log('Creating product:', dataToSend);
      const response = await api.post('/admin/products', dataToSend);
      console.log('Create response:', response.data);
      setSuccess('Product created successfully!');
      setShowAddProduct(false);
      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Create error:', err.response?.data || err);
      console.error('Full error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error creating product';
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/admin/products/${selectedProduct.id}`, productForm);
      setSuccess('Product updated successfully!');
      setShowEditProduct(false);
      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      await api.delete(`/admin/products/${selectedProduct.id}/permanent`);
      setSuccess('Product deleted successfully!');
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '', description: '', brand: '', price: '', storage: '128GB',
      condition: 'Brand New', color: '', ram: '8GB', quantity: 0, imageUrl: '', sku: '', isNewArrival: false, isPremiumDeal: false
    });
    setSelectedProduct(null);
    setImagePreview(null);
  };

  // Auto-generate SKU based on product details
  const generateSKU = () => {
    const { brand, name, storage } = productForm;
    if (!brand || !name) {
      setError('Please enter brand and product name first');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Generate SKU format: BRAND-MODEL-STORAGE-RANDOM
    const brandCode = brand.substring(0, 3).toUpperCase();
    const nameCode = name.split(' ').map(w => w.charAt(0)).join('').substring(0, 4).toUpperCase();
    const storageCode = storage.replace('GB', '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    
    const generatedSKU = `${brandCode}-${nameCode}-${storageCode}-${randomCode}`;
    setProductForm({...productForm, sku: generatedSKU});
    setSuccess(`SKU generated: ${generatedSKU}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setImagePreview(product.imageUrl ? `http://localhost:5000${product.imageUrl}` : null);
    setProductForm({
      name: product.name, description: product.description || '', brand: product.brand,
      price: product.price, storage: product.storage, condition: product.condition,
      color: product.color || '', ram: product.ram || '', quantity: product.quantity,
      imageUrl: product.imageUrl || '', sku: product.sku, isNewArrival: product.isNewArrival || false, isPremiumDeal: product.isPremiumDeal || false
    });
    setShowEditProduct(true);
  };

  const formatPrice = (price) => `Rs. ${parseFloat(price).toLocaleString()}`;
  
  const getStockStatus = (qty) => {
    if (qty === 0) return 'Out of Stock';
    if (qty <= 5) return 'Low Stock';
    return 'In Stock';
  };

  // Sample data for non-product sections
  const stats = [
    { label: 'Total Products', value: products.length, change: '+3', icon: Package, color: 'bg-purple-500' },
    { label: 'In Stock', value: products.filter(p => p.quantity > 5).length, change: '+8', icon: Box, color: 'bg-green-500' },
    { label: 'Low Stock', value: products.filter(p => p.quantity > 0 && p.quantity <= 5).length, change: '-2', icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'Out of Stock', value: products.filter(p => p.quantity === 0).length, change: '0', icon: X, color: 'bg-red-500' }
  ];

  const clients = [
    { id: 1, name: 'Kasun Perera', email: 'kasun@email.com', phone: '+94 77 123 4567', orders: 12, spent: 'Rs. 458,000', status: 'Active' },
    { id: 2, name: 'Nimali Silva', email: 'nimali@email.com', phone: '+94 71 234 5678', orders: 8, spent: 'Rs. 289,000', status: 'Active' },
    { id: 3, name: 'Ruwan Fernando', email: 'ruwan@email.com', phone: '+94 76 345 6789', orders: 5, spent: 'Rs. 156,000', status: 'Inactive' },
    { id: 4, name: 'Dilini Jayawardena', email: 'dilini@email.com', phone: '+94 78 456 7890', orders: 15, spent: 'Rs. 612,000', status: 'Active' }
  ];

  const recentOrders = [
    { id: 'ORD-2025-001', customer: 'Kasun Perera', product: 'iPhone 15 Pro', amount: 'Rs. 389,000', status: 'Delivered', date: '2025-12-27' },
    { id: 'ORD-2025-002', customer: 'Nimali Silva', product: 'Samsung S24', amount: 'Rs. 329,000', status: 'Shipped', date: '2025-12-26' },
    { id: 'ORD-2025-003', customer: 'Ruwan Fernando', product: 'Xiaomi 14', amount: 'Rs. 189,000', status: 'Processing', date: '2025-12-26' },
    { id: 'ORD-2025-004', customer: 'Dilini J.', product: 'AirPods Pro', amount: 'Rs. 78,000', status: 'Pending', date: '2025-12-25' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'brand-new', label: 'Brand New', icon: Sparkles },
    { id: 'pre-owned', label: 'Pre-Owned', icon: RotateCcw },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': case 'Active': case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Low Stock': case 'Shipped': return 'bg-yellow-100 text-yellow-700';
      case 'Out of Stock': case 'Inactive': case 'Pending': return 'bg-red-100 text-red-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-ksp-red" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/images/ksp-logo.png" alt="KSP Logo" className={`${sidebarOpen ? 'w-12 h-12' : 'w-10 h-10'} object-contain transition-all duration-300`} />
            {sidebarOpen && (
              <div>
                <span className="font-black text-lg text-white">KSP</span>
                <span className="block text-xs text-gray-400">Admin Panel</span>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-ksp-red text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
                <p className="text-xs text-gray-500">Manage your store</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-ksp-red/20 focus:bg-white transition-all w-52 text-sm"
                />
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-ksp-red rounded-full"></span>
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-ksp-red to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
                          <TrendingUp size={14} /> {stat.change}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
                    <select className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-around h-64 bg-gradient-to-t from-gray-50 to-transparent rounded-xl p-6">
                    {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div 
                          className="w-12 bg-gradient-to-t from-ksp-red to-red-400 rounded-t-lg transition-all hover:from-red-600 hover:to-red-500 cursor-pointer"
                          style={{ height: `${height * 2}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 font-medium">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button className="text-ksp-red text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 4).map((order, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                          <ShoppingCart size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.product}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <AlertCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Low Stock Alert</h3>
                    <p className="text-white/80 text-sm">{products.filter(p => p.quantity > 0 && p.quantity <= 5).length} products are running low on stock. Review inventory to avoid stockouts.</p>
                  </div>
                  <button onClick={() => setActiveTab('stock')} className="px-6 py-3 bg-white text-ksp-red font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    Review Stock
                  </button>
                </div>
              </div>

              {/* All Products with Filter */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">All Products</h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search products..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-ksp-red/20 w-64 text-sm" 
                        />
                      </div>
                      <select 
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ksp-red/20"
                      >
                        <option value="all">All Products</option>
                        <option value="Brand New">Brand New Only</option>
                        <option value="Pre-Owned">Pre-Owned Only</option>
                      </select>
                      <button 
                        onClick={fetchProducts}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                      >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                      </button>
                    </div>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">SKU</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Brand</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Condition</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        <RefreshCw size={24} className="animate-spin mx-auto mb-2" />Loading products...
                      </td></tr>
                    ) : products
                        .filter(p => conditionFilter === 'all' || p.condition === conditionFilter)
                        .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
                        .length === 0 ? (
                      <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No products found</td></tr>
                    ) : products
                        .filter(p => conditionFilter === 'all' || p.condition === conditionFilter)
                        .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${product.condition === 'Brand New' ? 'bg-green-100' : 'bg-orange-100'}`}>
                              {product.condition === 'Brand New' ? (
                                <Sparkles size={20} className="text-green-600" />
                              ) : (
                                <RotateCcw size={20} className="text-orange-600" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block">{product.name}</span>
                              <span className="text-xs text-gray-500">{product.storage}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                        <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${product.condition === 'Brand New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {product.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{product.quantity} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(getStockStatus(product.quantity))}`}>
                            {getStockStatus(product.quantity)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                              <Edit size={18} className="text-blue-500" />
                            </button>
                            <button onClick={() => { setSelectedProduct(product); setShowDeleteConfirm(true); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Brand New Tab */}
          {activeTab === 'brand-new' && (
            <>
              {/* Stock Summary Cards for Brand New */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Box size={22} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">In Stock</p>
                      <p className="text-2xl font-black text-gray-900">{products.filter(p => p.condition === 'Brand New' && p.quantity > 5).length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <AlertCircle size={22} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Low Stock</p>
                      <p className="text-2xl font-black text-gray-900">{products.filter(p => p.condition === 'Brand New' && p.quantity > 0 && p.quantity <= 5).length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <X size={22} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Out of Stock</p>
                      <p className="text-2xl font-black text-gray-900">{products.filter(p => p.condition === 'Brand New' && p.quantity === 0).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search brand new products..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-ksp-red/20 w-80" 
                    />
                  </div>
                  <button 
                    onClick={fetchProducts}
                    className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
                  </button>
                </div>
                <button 
                  onClick={() => { resetForm(); setProductForm(prev => ({...prev, condition: 'Brand New'})); setShowAddProduct(true); }}
                  className="flex items-center gap-2 px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  <Plus size={20} /> Add Brand New Product
                </button>
              </div>

              {/* Brand New Products Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-green-600" />
                    <span className="font-semibold text-green-800">Brand New Products</span>
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {products.filter(p => p.condition === 'Brand New').length} items
                    </span>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">SKU</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Brand</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <RefreshCw size={24} className="animate-spin mx-auto mb-2" />Loading products...
                      </td></tr>
                    ) : products.filter(p => p.condition === 'Brand New').length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No brand new products found</td></tr>
                    ) : products.filter(p => p.condition === 'Brand New').map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                              <Sparkles size={20} className="text-green-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block">{product.name}</span>
                              <span className="text-xs text-gray-500">{product.storage} • {product.condition}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                        <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{product.quantity} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(getStockStatus(product.quantity))}`}>
                            {getStockStatus(product.quantity)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                              <Edit size={18} className="text-blue-500" />
                            </button>
                            <button onClick={() => { setSelectedProduct(product); setShowDeleteConfirm(true); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pre-Owned Tab */}
          {activeTab === 'pre-owned' && (
            <>
              {/* Stock Summary Cards for Pre-Owned */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Box size={22} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">In Stock</p>
                      <p className="text-2xl font-black text-gray-900">{products.filter(p => p.condition === 'Pre-Owned' && p.quantity > 5).length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <AlertCircle size={22} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Low Stock</p>
                      <p className="text-2xl font-black text-gray-900">{products.filter(p => p.condition === 'Pre-Owned' && p.quantity > 0 && p.quantity <= 5).length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <X size={22} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Out of Stock</p>
                      <p className="text-2xl font-black text-gray-900">{products.filter(p => p.condition === 'Pre-Owned' && p.quantity === 0).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search pre-owned products..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-ksp-red/20 w-80" 
                    />
                  </div>
                  <button 
                    onClick={fetchProducts}
                    className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
                  </button>
                </div>
                <button 
                  onClick={() => { resetForm(); setProductForm(prev => ({...prev, condition: 'Pre-Owned'})); setShowAddProduct(true); }}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} /> Add Pre-Owned Product
                </button>
              </div>

              {/* Pre-Owned Products Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <RotateCcw size={20} className="text-orange-600" />
                    <span className="font-semibold text-orange-800">Pre-Owned Products</span>
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {products.filter(p => p.condition === 'Pre-Owned').length} items
                    </span>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">SKU</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Brand</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <RefreshCw size={24} className="animate-spin mx-auto mb-2" />Loading products...
                      </td></tr>
                    ) : products.filter(p => p.condition === 'Pre-Owned').length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No pre-owned products found</td></tr>
                    ) : products.filter(p => p.condition === 'Pre-Owned').map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                              <RotateCcw size={20} className="text-orange-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block">{product.name}</span>
                              <span className="text-xs text-gray-500">{product.storage} • {product.condition}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                        <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{product.quantity} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(getStockStatus(product.quantity))}`}>
                            {getStockStatus(product.quantity)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                              <Edit size={18} className="text-blue-500" />
                            </button>
                            <button onClick={() => { setSelectedProduct(product); setShowDeleteConfirm(true); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-ksp-red/20 w-80" />
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddClient(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  <Plus size={20} /> Add Client
                </button>
              </div>

              {/* Clients Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-ksp-red to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{client.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>📧 {client.email}</p>
                      <p>📞 {client.phone}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Orders</p>
                        <p className="font-bold text-gray-900">{client.orders}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Spent</p>
                        <p className="font-bold text-ksp-red">{client.spent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
                <div className="flex items-center gap-2">
                  <select className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-ksp-red">{order.id}</td>
                      <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-600">{order.product}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{order.amount}</td>
                      <td className="px-6 py-4 text-gray-600">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={18} className="text-gray-500" /></button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical size={18} className="text-gray-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl">
              {/* Settings Tabs */}
              <div className="flex items-center gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                <button
                  onClick={() => setSettingsTab('store')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${settingsTab === 'store' ? 'bg-ksp-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Store Settings
                </button>
                <button
                  onClick={() => setSettingsTab('about')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${settingsTab === 'about' ? 'bg-ksp-red text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  About Us Page
                </button>
              </div>

              {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{success}</div>}

              {/* Store Settings */}
              {settingsTab === 'store' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Store Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                      <input type="text" value={aboutForm.storeName} onChange={(e) => setAboutForm({...aboutForm, storeName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                      <input type="email" value={aboutForm.email} onChange={(e) => setAboutForm({...aboutForm, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input type="text" value={aboutForm.phone} onChange={(e) => setAboutForm({...aboutForm, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Store Address</label>
                      <input type="text" value={aboutForm.address} onChange={(e) => setAboutForm({...aboutForm, address: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Working Hours</label>
                      <input type="text" value={aboutForm.workingHours} onChange={(e) => setAboutForm({...aboutForm, workingHours: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                    </div>
                    <button onClick={handleSaveAboutUs} className="flex items-center gap-2 px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* About Us Settings */}
              {settingsTab === 'about' && (
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name / Title</label>
                        <input type="text" value={aboutForm.storeName} onChange={(e) => setAboutForm({...aboutForm, storeName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                        <input type="text" value={aboutForm.tagline} onChange={(e) => setAboutForm({...aboutForm, tagline: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Years in Business</label>
                        <input type="text" value={aboutForm.yearsInBusiness} onChange={(e) => setAboutForm({...aboutForm, yearsInBusiness: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Happy Customers</label>
                        <input type="text" value={aboutForm.happyCustomers} onChange={(e) => setAboutForm({...aboutForm, happyCustomers: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brands Available</label>
                        <input type="text" value={aboutForm.brandsAvailable} onChange={(e) => setAboutForm({...aboutForm, brandsAvailable: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Warranty Support</label>
                        <input type="text" value={aboutForm.warrantySupport} onChange={(e) => setAboutForm({...aboutForm, warrantySupport: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">About Content</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Store Description</label>
                        <textarea rows={4} value={aboutForm.description} onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 resize-none"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Our Mission</label>
                        <textarea rows={3} value={aboutForm.mission} onChange={(e) => setAboutForm({...aboutForm, mission: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 resize-none"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Our Vision</label>
                        <textarea rows={3} value={aboutForm.vision} onChange={(e) => setAboutForm({...aboutForm, vision: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <input type="text" value={aboutForm.address} onChange={(e) => setAboutForm({...aboutForm, address: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <input type="text" value={aboutForm.phone} onChange={(e) => setAboutForm({...aboutForm, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                          <input type="email" value={aboutForm.email} onChange={(e) => setAboutForm({...aboutForm, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Working Hours</label>
                        <input type="text" value={aboutForm.workingHours} onChange={(e) => setAboutForm({...aboutForm, workingHours: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSaveAboutUs} className="flex items-center gap-2 px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    <Save size={18} /> Save About Us Content
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
            {success && <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{success}</div>}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} placeholder="e.g. iPhone 15 Pro Max" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
                <div className="flex gap-2">
                  <input type="text" value={productForm.sku} onChange={(e) => setProductForm({...productForm, sku: e.target.value})} placeholder="e.g. IPH-15PM-256-BLK" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                  <button type="button" onClick={generateSKU} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm flex items-center gap-2">
                    <Sparkles size={16} /> Generate
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                  <select value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20">
                    <option value="">Select Brand</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20">
                    <option value="Phones">Phones</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Storage</label>
                <input type="text" value={productForm.storage} onChange={(e) => setProductForm({...productForm, storage: e.target.value})} placeholder="e.g. 256GB" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.) *</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} placeholder="389000" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                  <input type="number" value={productForm.quantity} onChange={(e) => setProductForm({...productForm, quantity: e.target.value})} placeholder="50" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} placeholder="Product description..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                  <select value={productForm.condition} onChange={(e) => setProductForm({...productForm, condition: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20">
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-Owned">Pre-Owned</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={productForm.isNewArrival} 
                      onChange={(e) => setProductForm({...productForm, isNewArrival: e.target.checked})}
                      className="w-5 h-5 text-ksp-red rounded focus:ring-2 focus:ring-ksp-red/20"
                    />
                    <span className="text-sm font-semibold text-gray-700">New Arrival</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-3 px-4 py-3 border border-green-200 rounded-xl hover:bg-green-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={productForm.isPremiumDeal} 
                      onChange={(e) => setProductForm({...productForm, isPremiumDeal: e.target.checked})}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500/20"
                    />
                    <span className="text-sm font-semibold text-gray-700">Premium Deal</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {(imagePreview || productForm.imageUrl) && (
                    <div className="relative w-32 h-32 border border-gray-200 rounded-xl overflow-hidden">
                      <img 
                        src={imagePreview || (productForm.imageUrl.startsWith('/') ? `http://localhost:5000${productForm.imageUrl}` : productForm.imageUrl)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => { setImagePreview(null); setProductForm({...productForm, imageUrl: ''}); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >×</button>
                    </div>
                  )}
                  {/* File Upload */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-ksp-red/50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/png,image/jpeg,image/jpg,image/webp" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {uploadingImage ? (
                        <span className="text-gray-500">Uploading...</span>
                      ) : (
                        <span className="text-gray-500">📷 Click to upload image (PNG, JPG, WebP - max 5MB)</span>
                      )}
                    </label>
                  </div>
                  {/* OR URL Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">OR enter URL:</span>
                    <input 
                      type="text" 
                      value={productForm.imageUrl} 
                      onChange={(e) => { setProductForm({...productForm, imageUrl: e.target.value}); setImagePreview(null); }} 
                      placeholder="/images/products/phone.png" 
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-ksp-red/20" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button onClick={() => { setShowAddProduct(false); resetForm(); }} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreateProduct} disabled={loading} className="px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
              <button onClick={() => { setShowEditProduct(false); setSelectedProduct(null); }} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
            {success && <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{success}</div>}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                <input type="text" value={productForm.sku} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                  <select value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20">
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20">
                    <option value="Phones">Phones</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Storage</label>
                <input type="text" value={productForm.storage} onChange={(e) => setProductForm({...productForm, storage: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.) *</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                  <input type="number" value={productForm.quantity} onChange={(e) => setProductForm({...productForm, quantity: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                  <select value={productForm.condition} onChange={(e) => setProductForm({...productForm, condition: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20">
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-Owned">Pre-Owned</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={productForm.isNewArrival} 
                      onChange={(e) => setProductForm({...productForm, isNewArrival: e.target.checked})}
                      className="w-5 h-5 text-ksp-red rounded focus:ring-2 focus:ring-ksp-red/20"
                    />
                    <span className="text-sm font-semibold text-gray-700">New Arrival</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-3 px-4 py-3 border border-green-200 rounded-xl hover:bg-green-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={productForm.isPremiumDeal} 
                      onChange={(e) => setProductForm({...productForm, isPremiumDeal: e.target.checked})}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500/20"
                    />
                    <span className="text-sm font-semibold text-gray-700">Premium Deal</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                <div className="space-y-3">
                  {(imagePreview || productForm.imageUrl) && (
                    <div className="relative w-32 h-32 border border-gray-200 rounded-xl overflow-hidden">
                      <img 
                        src={imagePreview || (productForm.imageUrl.startsWith('/') ? `http://localhost:5000${productForm.imageUrl}` : productForm.imageUrl)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => { setImagePreview(null); setProductForm({...productForm, imageUrl: ''}); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >×</button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-ksp-red/50 transition-colors">
                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageUpload} className="hidden" />
                      {uploadingImage ? <span className="text-gray-500">Uploading...</span> : <span className="text-gray-500">📷 Upload new image</span>}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">OR URL:</span>
                    <input type="text" value={productForm.imageUrl} onChange={(e) => { setProductForm({...productForm, imageUrl: e.target.value}); setImagePreview(null); }} placeholder="/images/products/phone.png" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button onClick={() => { setShowEditProduct(false); setSelectedProduct(null); resetForm(); }} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleUpdateProduct} disabled={loading} className="px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h2>
              <p className="text-gray-500 mb-6">Are you sure you want to delete <span className="font-semibold">"{selectedProduct.name}"</span>? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => { setShowDeleteConfirm(false); setSelectedProduct(null); }} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteProduct} disabled={loading} className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Client</h2>
              <button onClick={() => setShowAddClient(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" placeholder="e.g. Kasun Perera" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" placeholder="+94 77 123 4567" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea rows={2} placeholder="Full address..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 resize-none"></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button onClick={() => setShowAddClient(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
