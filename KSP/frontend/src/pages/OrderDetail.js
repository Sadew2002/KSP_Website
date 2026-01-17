import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaClock, FaTimesCircle,
  FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaPhone, FaEnvelope,
  FaUser, FaCalendarAlt, FaReceipt, FaShippingFast
} from 'react-icons/fa';
import { orderService, authService } from '../services/apiService';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrderById(orderId);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load order details');
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login', { state: { from: `/orders/${orderId}` } });
      return;
    }
    fetchOrder();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [navigate, orderId, fetchOrder]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: FaClock, label: 'Order Placed' },
      confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FaCheckCircle, label: 'Confirmed' },
      processing: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: FaBox, label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FaTruck, label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-700 border-green-200', icon: FaCheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: FaTimesCircle, label: 'Cancelled' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getStatusSteps = () => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(order?.status?.toLowerCase());
    return steps.map((step, index) => ({
      step,
      label: getStatusConfig(step).label,
      icon: getStatusConfig(step).icon,
      completed: index <= currentIndex && order?.status?.toLowerCase() !== 'cancelled',
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-ksp-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-red-500 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/profile" state={{ activeTab: 'orders' }} className="px-6 py-3 bg-ksp-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/profile', { state: { activeTab: 'orders' } })}
            className="w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-500">Order #{order.orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className={`p-6 ${statusConfig.color.replace('text-', 'bg-').split(' ')[0]}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center">
                    <StatusIcon className={`text-2xl ${statusConfig.color.split(' ')[1]}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${statusConfig.color.split(' ')[1]}`}>
                      {statusConfig.label}
                    </h2>
                    <p className={`text-sm ${statusConfig.color.split(' ')[1]} opacity-80`}>
                      Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              {order.status?.toLowerCase() !== 'cancelled' && (
                <div className="p-6">
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                      <div 
                        className="h-full bg-gradient-to-r from-ksp-red to-red-500 transition-all duration-500"
                        style={{ width: `${(getStatusSteps().filter(s => s.completed).length - 1) / 4 * 100}%` }}
                      ></div>
                    </div>
                    
                    {getStatusSteps().map((step, index) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={step.step} className="flex flex-col items-center z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            step.completed 
                              ? 'bg-gradient-to-r from-ksp-red to-red-500 text-white shadow-lg' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <StepIcon size={16} />
                          </div>
                          <span className={`text-xs mt-2 font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaBox className="text-ksp-red" /> Order Items ({order.items?.length || 0})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <div key={item._id || idx} className="p-4 md:p-6 flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.productId?.imageUrl || item.product?.image ? (
                        <img 
                          src={item.productId?.imageUrl || item.product?.image} 
                          alt={item.productId?.name || item.product?.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                        />
                      ) : (
                        <FaBox className="text-gray-300 text-2xl" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.productId?.name || item.product?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.productId?.brand || item.product?.brand || ''}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        LKR {parseFloat(item.pricePerUnit || item.price || 0).toLocaleString('en-LK')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Subtotal: LKR {parseFloat(item.subtotal || (item.price * item.quantity) || 0).toLocaleString('en-LK')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FaShippingFast className="text-ksp-red" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <FaMapMarkerAlt className="text-ksp-red mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Address</p>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress}
                      {order.shippingCity && `, ${order.shippingCity}`}
                      {order.shippingProvince && `, ${order.shippingProvince}`}
                      {order.shippingPostalCode && ` ${order.shippingPostalCode}`}
                    </p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <FaTruck className="text-ksp-red mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tracking Number</p>
                      <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>
              {order.notes && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <p className="text-xs text-yellow-700 uppercase tracking-wide mb-1">Order Notes</p>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FaReceipt className="text-ksp-red" /> Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>LKR {parseFloat(order.totalAmount || 0).toLocaleString('en-LK')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-ksp-red text-xl">
                    LKR {parseFloat(order.totalAmount || 0).toLocaleString('en-LK')}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                {order.paymentMethod === 'cash_on_delivery' || order.paymentMethod === 'cod' 
                  ? <FaMoneyBillWave className="text-ksp-red" /> 
                  : <FaCreditCard className="text-ksp-red" />
                }
                Payment
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'cash_on_delivery' || order.paymentMethod === 'cod' 
                      ? '💵 Cash on Delivery' 
                      : order.paymentMethod === 'bank_slip'
                      ? '🏦 Bank Transfer'
                      : '💳 Card Payment'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-700' 
                      : order.paymentStatus === 'pending_verification'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus === 'pending_verification' ? 'Verifying' : order.paymentStatus || 'Pending'}
                  </span>
                </div>
                {order.paymentMethod === 'bank_slip' && order.paymentStatus === 'pending_verification' && (
                  <p className="text-xs text-orange-600 mt-2">
                    Your bank slip is being verified. This usually takes 1-2 business hours.
                  </p>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FaCalendarAlt className="text-ksp-red" /> Order Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono font-medium">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Placed On</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link 
                to="/profile" 
                state={{ activeTab: 'orders' }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft /> Back to Orders
              </Link>
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <button 
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                  onClick={() => {/* Handle cancel */}}
                >
                  <FaTimesCircle /> Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
