import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, Send, Facebook, Instagram, Youtube } from 'lucide-react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#1a1a1a', fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-ksp-red/5 rounded-full -ml-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ksp-red/5 rounded-full -mr-48 -mb-48 blur-3xl"></div>
      
      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-ksp-red to-red-700 rounded-3xl p-8 md:p-12">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Stay Updated</h3>
              <p className="text-white/80">Get exclusive deals and latest arrivals directly to your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full md:w-80 px-6 py-4 rounded-l-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-all"
              />
              <button className="px-8 py-4 bg-white text-ksp-red font-bold rounded-r-full hover:bg-gray-100 transition-all duration-300 flex items-center gap-2">
                Subscribe <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/ksp-logo.png" alt="KSP Logo" className="h-16 w-16 object-contain" />
              <div>
                <h3 className="text-2xl font-black text-white">KANDY SUPER</h3>
                <span className="text-ksp-red font-black text-2xl">PHONE</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your trusted destination for premium smartphones and accessories. We bring you the latest technology from the world's leading brands with unbeatable prices and exceptional service.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={18} />, name: 'facebook' },
                { icon: <Instagram size={18} />, name: 'instagram' },
                { icon: <FaWhatsapp size={18} />, name: 'whatsapp' },
                { icon: <Youtube size={18} />, name: 'youtube' },
                { icon: <FaTiktok size={18} />, name: 'tiktok' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-ksp-red hover:border-ksp-red hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-ksp-red rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-4">
              {['Home', 'Products', 'Brands', 'Deals', 'New Arrivals'].map((link, i) => (
                <li key={i}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-ksp-red hover:pl-2 transition-all duration-300 flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-ksp-red rounded-full"></span>
              Support
            </h4>
            <ul className="space-y-4">
              {['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Warranty'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-ksp-red hover:pl-2 transition-all duration-300 flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-ksp-red rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-ksp-red/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-ksp-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">No. 123, Main Street,</p>
                  <p className="text-gray-400 text-sm">Kandy, Sri Lanka</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ksp-red/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-ksp-red" />
                </div>
                <div>
                  <p className="text-white font-semibold">+94 81 234 5678</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ksp-red/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-ksp-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">info@kandysuperphone.lk</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ksp-red/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-ksp-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Mon - Sat: 9AM - 8PM</p>
                  <p className="text-gray-400 text-sm">Sunday: 10AM - 6PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Kandy Super Phone. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link, i) => (
                <a key={i} href="#" className="text-gray-500 text-sm hover:text-ksp-red transition-colors">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs">Payment Partners:</span>
              <div className="flex gap-2">
                {['💳', '🏦', '📱'].map((icon, i) => (
                  <span key={i} className="text-xl">{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
