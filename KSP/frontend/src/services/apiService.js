import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setAuthToken: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderService = {
  getOrders: () => api.get('/orders'),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

export const paymentService = {
  processPayment: (paymentData) => api.post('/payments/process-payment', paymentData),
  getPaymentStatus: (orderId) => api.get(`/payments/${orderId}`),
};

export const adminService = {
  // Products
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getInventory: () => api.get('/admin/products/inventory'),
  
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  updateTracking: (orderId, trackingData) => api.put(`/admin/orders/${orderId}/tracking`, trackingData),
  
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  updateUserStatus: (userId, isActive) => api.put(`/admin/users/${userId}/status`, { isActive }),
  
  // Reports
  getSalesReport: (params) => api.get('/admin/reports/sales', { params }),
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
  getCustomersReport: (params) => api.get('/admin/reports/customers', { params }),
  getInventoryReport: (params) => api.get('/admin/reports/inventory', { params }),
};
