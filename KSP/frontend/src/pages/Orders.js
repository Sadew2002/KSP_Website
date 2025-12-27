import React, { useState } from 'react';
import { FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

const Orders = () => {
  const [orders] = useState([]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'text-ksp-green';
      case 'shipped': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle />;
      case 'shipped': return <FaTruck />;
      default: return <FaBox />;
    }
  };

  return (
    <div className="bg-ksp-gray min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-ksp-black">My Orders</h1>
        <p className="text-gray-600 mb-8">Track and manage your orders</p>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-ksp-black mb-2">Order #{order.orderId}</h3>
                    <p className="text-gray-600 text-sm mb-3">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="price-tag mb-3">Rs. {order.totalAmount.toLocaleString('en-LK')}</p>
                    <button className="btn-secondary text-sm">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-ksp-black mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to create your first order</p>
            <a href="/products" className="btn-primary">
              Shop Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
