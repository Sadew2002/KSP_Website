import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Categories for dropdowns
  const categories = [
    { name: 'Phones', slug: 'phones' },
    { name: 'Tablets', slug: 'tablets' },
    { name: 'Earbuds', slug: 'earbuds' },
    { name: 'Smartwatches', slug: 'smartwatches' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdown(mobileDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 lg:gap-3 group flex-shrink-0">
            <img
              src="/images/ksp-logo.png"
              alt="Kandy Super Phone"
              className="h-12 w-12 lg:h-16 lg:w-16 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-base lg:text-xl font-black text-gray-900">
                KANDY SUPER
              </span>
              <span className="text-base lg:text-xl font-black text-ksp-red">
                PHONE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2" ref={dropdownRef}>
            {/* New Arrivals with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('new-arrivals')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link 
                to="/products?condition=Brand New"
                className="flex items-center gap-1 px-3 xl:px-4 py-2 text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 rounded-lg hover:bg-gray-50"
              >
                New Arrivals
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${activeDropdown === 'new-arrivals' ? 'rotate-180' : ''}`} 
                />
              </Link>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${activeDropdown === 'new-arrivals' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/products?condition=Brand New&category=${category.slug}`}
                      className="block px-4 py-2.5 text-gray-600 hover:bg-ksp-red hover:text-white transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Pre Owned with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('pre-owned')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link 
                to="/products?condition=Pre-Owned"
                className="flex items-center gap-1 px-3 xl:px-4 py-2 text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 rounded-lg hover:bg-gray-50"
              >
                Pre Owned
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${activeDropdown === 'pre-owned' ? 'rotate-180' : ''}`} 
                />
              </Link>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${activeDropdown === 'pre-owned' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/products?condition=Pre-Owned&category=${category.slug}`}
                      className="block px-4 py-2.5 text-gray-600 hover:bg-ksp-red hover:text-white transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders */}
            <Link
              to="/orders"
              className="px-3 xl:px-4 py-2 text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 rounded-lg hover:bg-gray-50"
            >
              Orders
            </Link>

            {/* About Us */}
            <Link
              to="/about"
              className="px-3 xl:px-4 py-2 text-gray-700 hover:text-ksp-red font-semibold transition-colors duration-300 rounded-lg hover:bg-gray-50"
            >
              About Us
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Bar (Desktop) */}
            <div className="hidden xl:flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors duration-300">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none w-32"
              />
              <Search size={18} className="text-gray-500" />
            </div>

            {/* Search Icon (Tablet) */}
            <button className="xl:hidden p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full">
              <Search size={22} />
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-ksp-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Account Icon */}
            <Link
              to="/login"
              className="hidden sm:block p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full"
            >
              <User size={22} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-ksp-red transition-colors duration-300 hover:bg-gray-100 rounded-full"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-gray-50 border-t border-gray-200 animate-slideDown">
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

              {/* New Arrivals with Dropdown */}
              <div>
                <div className="flex items-center">
                  <Link
                    to="/products?condition=Brand New"
                    onClick={toggleMenu}
                    className="flex-1 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                  >
                    New Arrivals
                  </Link>
                  <button
                    onClick={() => toggleMobileDropdown('new-arrivals')}
                    className="px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300"
                  >
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${mobileDropdown === 'new-arrivals' ? 'rotate-180' : ''}`} 
                    />
                  </button>
                </div>
                {mobileDropdown === 'new-arrivals' && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-ksp-red/30 pl-3">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products?condition=Brand New&category=${category.slug}`}
                        className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300"
                        onClick={toggleMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Pre Owned with Dropdown */}
              <div>
                <div className="flex items-center">
                  <Link
                    to="/products?condition=Pre-Owned"
                    onClick={toggleMenu}
                    className="flex-1 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                  >
                    Pre Owned
                  </Link>
                  <button
                    onClick={() => toggleMobileDropdown('pre-owned')}
                    className="px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300"
                  >
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${mobileDropdown === 'pre-owned' ? 'rotate-180' : ''}`} 
                    />
                  </button>
                </div>
                {mobileDropdown === 'pre-owned' && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-ksp-red/30 pl-3">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products?condition=Pre-Owned&category=${category.slug}`}
                        className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300"
                        onClick={toggleMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/orders"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                onClick={toggleMenu}
              >
                Orders
              </Link>
              <Link
                to="/about"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-ksp-red transition-colors duration-300 font-semibold"
                onClick={toggleMenu}
              >
                About Us
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
