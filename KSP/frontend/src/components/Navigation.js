import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/ksp-logo.png"
              alt="Kandy Super Phone"
              className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-xl font-black text-gray-900">
                KANDY SUPER
              </span>
              <span className="text-xl font-black text-ksp-red">
                PHONE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/products"
              className="text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 relative group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ksp-red group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 relative group"
            >
              Brands
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ksp-red group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 relative group"
            >
              Orders
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ksp-red group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ksp-red group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors duration-300">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none w-36"
              />
              <Search size={18} className="text-gray-500" />
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-ksp-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Account Icon */}
            <Link
              to="/login"
              className="hidden sm:block p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full"
            >
              <User size={24} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-200 animate-slideDown">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2 mb-3">
                <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-300">
                  <input
                    type="text"
                    placeholder="Search phones..."
                    className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none flex-1"
                  />
                  <Search size={18} className="text-gray-500" />
                </div>
              </div>

              <Link
                to="/products"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link
                to="/products"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                onClick={toggleMenu}
              >
                Brands
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                onClick={toggleMenu}
              >
                Orders
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <div className="border-t border-gray-300 mt-3 pt-3">
                <Link
                  to="/login"
                  className="block px-3 py-3 rounded-lg bg-ksp-red text-white hover:bg-red-700 transition-colors duration-300 font-semibold text-center"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
