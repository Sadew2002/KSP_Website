import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaLock, 
  FaShoppingBag, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash,
  FaCheckCircle, FaExclamationCircle, FaBox, FaTruck, FaClock,
  FaCog, FaChevronDown, FaUserEdit, FaShieldAlt, FaSignOutAlt
} from 'react-icons/fa';
import { authService, orderService } from '../services/apiService';

// Reusable components
const InfoCard = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="w-10 h-10 bg-ksp-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="text-ksp-red" size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-gray-800 truncate">{value || 'Not provided'}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-ksp-red to-red-600 text-white shadow-lg shadow-red-200' 
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-ksp-red border border-gray-200'
    }`}
  >
    <Icon size={18} />
    <span className="hidden sm:inline">{label}</span>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-ksp-red text-white text-xs rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const Alert = ({ type, message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700'
  };
  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle
  };
  const Icon = icons[type];
  
  return (
    <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-fadeIn ${styles[type]}`}>
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

const PasswordInput = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all"
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    role: '', createdAt: ''
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  // Memoized values
  const pendingOrders = useMemo(() => 
    orders.filter(o => ['pending', 'processing', 'confirmed'].includes(o.status?.toLowerCase())).length
  , [orders]);

  const profileCompletion = useMemo(() => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];
    const filled = fields.filter(f => profile[f]).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authService.getProfile();
      if (response.data.success) {
        setProfile(response.data.user);
        setEditForm(response.data.user);
      }
    } catch (err) {
      setError('Failed to load profile');
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const response = await orderService.getOrders();
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Check auth and fetch data
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    fetchProfile();
    fetchOrders();
  }, [navigate, fetchProfile, fetchOrders]);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Handlers
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        address: editForm.address,
        city: editForm.city,
        province: editForm.province,
        postalCode: editForm.postalCode
      });

      if (response.data.success) {
        setProfile(response.data.user);
        const currentUser = authService.getCurrentUser();
        authService.setAuthToken(localStorage.getItem('authToken'), {
          ...currentUser, ...response.data.user
        });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const response = await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { color: 'bg-green-100 text-green-700', icon: FaCheckCircle },
      shipped: { color: 'bg-blue-100 text-blue-700', icon: FaTruck },
      processing: { color: 'bg-yellow-100 text-yellow-700', icon: FaBox },
      confirmed: { color: 'bg-yellow-100 text-yellow-700', icon: FaBox },
      pending: { color: 'bg-orange-100 text-orange-700', icon: FaClock },
      cancelled: { color: 'bg-red-100 text-red-700', icon: FaExclamationCircle }
    };
    return configs[status?.toLowerCase()] || { color: 'bg-gray-100 text-gray-700', icon: FaBox };
  };

  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-ksp-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header with Settings */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-500">Manage your profile and orders</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {profile.role === 'admin' && (
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaUser size={14} /> Admin Dashboard
              </Link>
            )}
            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  settingsOpen || activeTab === 'edit' || activeTab === 'security'
                    ? 'bg-gradient-to-r from-ksp-red to-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaCog className={`transition-transform duration-300 ${settingsOpen ? 'rotate-90' : ''}`} size={18} />
                <span className="hidden sm:inline">Settings</span>
                <FaChevronDown className={`transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''}`} size={12} />
              </button>
              
              {/* Dropdown Menu */}
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => { setActiveTab('edit'); setIsEditing(true); setSettingsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === 'edit' ? 'bg-ksp-red/5 text-ksp-red' : 'text-gray-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      activeTab === 'edit' ? 'bg-ksp-red/10' : 'bg-gray-100'
                    }`}>
                      <FaUserEdit size={16} />
                    </div>
                    <div>
                      <p className="font-semibold">Edit Profile</p>
                      <p className="text-xs text-gray-400">Update your information</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setActiveTab('security'); setSettingsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === 'security' ? 'bg-ksp-red/5 text-ksp-red' : 'text-gray-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      activeTab === 'security' ? 'bg-ksp-red/10' : 'bg-gray-100'
                    }`}>
                      <FaShieldAlt size={16} />
                    </div>
                    <div>
                      <p className="font-semibold">Security</p>
                      <p className="text-xs text-gray-400">Change your password</p>
                    </div>
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50">
                      <FaSignOutAlt size={16} />
                    </div>
                    <div>
                      <p className="font-semibold">Logout</p>
                      <p className="text-xs text-red-400">Sign out of your account</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Only Profile and Orders */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => { setActiveTab('profile'); setIsEditing(false); }} 
            icon={FaUser} 
            label="Profile" 
          />
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
            icon={FaShoppingBag} 
            label="Orders"
            badge={pendingOrders}
          />
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Profile Tab - View Mode */}
        {activeTab === 'profile' && !isEditing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-ksp-red to-red-600"></div>
              <div className="px-6 pb-6 -mt-12 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white">
                  <div className="w-20 h-20 bg-gradient-to-br from-ksp-red to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-500 text-sm mb-3">{profile.email}</p>
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full text-sm font-semibold text-gray-700 capitalize border border-gray-200">
                  {profile.role}
                </span>
                
                {/* Profile Completion */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Profile Completion</span>
                    <span className="text-sm font-bold text-ksp-red">{profileCompletion}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-ksp-red to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  {profileCompletion < 100 && (
                    <button 
                      onClick={() => { setActiveTab('edit'); setIsEditing(true); }}
                      className="text-xs text-ksp-red mt-2 hover:underline"
                    >
                      Complete your profile →
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details - View Mode */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
                <button 
                  onClick={() => { setActiveTab('edit'); setIsEditing(true); }} 
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  <FaEdit size={14} /> Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoCard icon={FaUser} label="First Name" value={profile.firstName} />
                  <InfoCard icon={FaUser} label="Last Name" value={profile.lastName} />
                </div>
                <InfoCard icon={FaEnvelope} label="Email Address" value={profile.email} />
                <InfoCard icon={FaPhone} label="Phone Number" value={profile.phone} />
                <InfoCard icon={FaMapMarkerAlt} label="Address" value={profile.address} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoCard icon={FaCity} label="City" value={profile.city} />
                  <InfoCard icon={FaMapMarkerAlt} label="Province" value={profile.province} />
                  <InfoCard icon={FaMapMarkerAlt} label="Postal Code" value={profile.postalCode} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Tab */}
        {(activeTab === 'edit' || (activeTab === 'profile' && isEditing)) && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-ksp-red to-red-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <FaUserEdit className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <p className="text-white/80 text-sm">Update your personal information</p>
                  </div>
                </div>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input type="text" name="firstName" value={editForm.firstName || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input type="text" name="lastName" value={editForm.lastName || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" value={editForm.email || ''} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="+94 77 123 4567" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input type="text" name="address" value={editForm.address || ''} onChange={handleEditChange} placeholder="Enter your full address" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input type="text" name="city" value={editForm.city || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                    <select name="province" value={editForm.province || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all">
                      <option value="">Select Province</option>
                      {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={editForm.postalCode || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setActiveTab('profile'); setIsEditing(false); setEditForm(profile); }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-ksp-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-50">
                    <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-ksp-red to-red-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <FaShoppingBag className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Order History</h2>
                      <p className="text-white/80 text-sm">Track and manage your orders</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-white">
                    <div className="text-center px-4 border-r border-white/20">
                      <p className="text-2xl font-bold">{orders.length}</p>
                      <p className="text-xs text-white/70">Total Orders</p>
                    </div>
                    <div className="text-center px-4 border-r border-white/20">
                      <p className="text-2xl font-bold">{pendingOrders}</p>
                      <p className="text-xs text-white/70">In Progress</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                      <p className="text-xs text-white/70">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {ordersLoading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-12 h-12 border-4 border-ksp-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingBag className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                <button onClick={() => navigate('/products')} className="px-6 py-3 bg-gradient-to-r from-ksp-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Order Header */}
                      <div className="p-4 md:p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig.color}`}>
                              <StatusIcon size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono text-sm font-bold text-gray-900">{order.orderId}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusConfig.color}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              LKR {parseFloat(order.totalAmount).toLocaleString('en-LK')}
                            </p>
                            <p className="text-sm text-gray-500 capitalize flex items-center justify-end gap-1">
                              {order.paymentMethod === 'card' ? '💳 Card Payment' : '💵 Cash on Delivery'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-4 md:p-6 bg-gray-50/50">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Order Items ({order.items?.length})</p>
                        <div className="space-y-3">
                          {order.items?.map((item, idx) => (
                            <div key={item._id || idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100">
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {item.product?.image ? (
                                  <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                ) : (
                                  <FaBox className="text-gray-300 text-xl" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{item.product?.name || 'Product'}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-gray-900">LKR {parseFloat(item.price).toLocaleString('en-LK')}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <FaMapMarkerAlt className="text-ksp-red mt-0.5 flex-shrink-0" />
                          <span>{order.shippingAddress}</span>
                        </div>
                        <div className="flex gap-2">
                          {order.status === 'delivered' && (
                            <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                              Reorder
                            </button>
                          )}
                          <Link 
                            to={`/orders/${order._id}`}
                            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-ksp-red to-red-600 rounded-lg hover:shadow-lg hover:shadow-red-200 transition-all"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-ksp-red to-red-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Security Settings</h2>
                    <p className="text-white/80 text-sm">Update your password regularly</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <PasswordInput 
                  label="Current Password" 
                  name="currentPassword" 
                  value={passwordForm.currentPassword} 
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <PasswordInput 
                  label="New Password" 
                  name="newPassword" 
                  value={passwordForm.newPassword} 
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-400 -mt-2">Minimum 6 characters</p>
                <PasswordInput 
                  label="Confirm New Password" 
                  name="confirmPassword" 
                  value={passwordForm.confirmPassword} 
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('profile')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-ksp-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-50">
                    <FaLock /> {saving ? 'Changing...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="px-6 pb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Password Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> At least 6 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Include letters and numbers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Avoid common passwords
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
