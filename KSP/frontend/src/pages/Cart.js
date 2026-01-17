import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div className="bg-ksp-gray min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-ksp-black">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <p className="text-gray-600 text-center py-12">Your cart is empty</p>
              <div className="text-center">
                <Link to="/products" className="btn-primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="card h-fit sticky top-20">
            <h2 className="text-2xl font-bold text-ksp-black mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">LKR 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-ksp-green">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">LKR 0</span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-xl font-bold text-ksp-black">Total</span>
              <span className="price-tag">LKR 0</span>
            </div>
            <button className="btn-primary w-full disabled:opacity-50">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
