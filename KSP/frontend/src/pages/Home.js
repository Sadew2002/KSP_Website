import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Truck, 
  ShieldCheck, 
  Headphones, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Gift
} from 'lucide-react';

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Optional: Add any video-related logic here
  }, []);

  return (
    <div className="text-gray-900 min-h-screen overflow-x-hidden" style={{ backgroundColor: '#c4c4c4', fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-12 md:py-16 px-24 pt-12 md:pt-16" 
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}>
        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-2xl shadow-2xl bg-black">
        
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              backgroundColor: '#000',
            }}
            onLoadStart={() => console.log('Video loading...')}
            onCanPlay={() => console.log('Video ready')}
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
            <source src="/videos/hero-video.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          </div>
        </div>
      </section>

      {/* --- FEATURES: GLASS CARDS --- */}
      <section className="container mx-auto px-6 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck className="text-ksp-red" />, title: "Certified Authentic", desc: "100% Genuine products with global manufacturer warranty." },
            { icon: <Gift className="text-ksp-red" />, title: "Exclusive Deals", desc: "Special offers and discounts for loyal customers." },
            { icon: <Headphones className="text-ksp-red" />, title: "Expert Support", desc: "Dedicated support whenever you need assistance." }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-2xl hover:border-ksp-red/50 hover:from-white/60 hover:to-white/20 transition-all duration-500">
              <div className="mb-4 p-3 bg-gradient-to-br from-gray-100/60 to-gray-200/20 backdrop-blur-sm rounded-2xl inline-block group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CATEGORIES: BENTO GRID --- */}
      <section className="container mx-auto px-6 py-24 rounded-3xl mt-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">Browse Collections</h2>
            <p className="text-gray-600 mt-2">Find the perfect companion for your lifestyle.</p>
          </div>
          <Link to="/products" className="text-ksp-red font-semibold flex items-center gap-2 hover:underline">
            View all brands <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {/* Large Card */}
          <Link to="/products?brand=apple" className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-gray-400 hover:border-ksp-red/50 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" style={{ backgroundImage: 'url(/images/iphone-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', perspective: '1000px' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.transform = `scale(1.01) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)'; }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
            <div className="absolute inset-0 group-hover:bg-ksp-red/10 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8 transform group-hover:translate-y-2 transition-transform duration-500">
              <span className="text-xs font-bold tracking-widest text-ksp-red uppercase group-hover:text-white transition-colors duration-500">Premium</span>
              <h3 className="text-3xl font-bold mt-1 text-white group-hover:text-ksp-red transition-colors duration-500">Apple iPhone</h3>
            </div>
          </Link>

          {/* Medium Card */}
          <Link to="/products?brand=samsung" className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-gray-400 hover:border-ksp-red/50 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" style={{ backgroundImage: 'url(/images/samsung-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', perspective: '1000px' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.transform = `scale(1.01) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)'; }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
            <div className="absolute inset-0 group-hover:bg-ksp-red/10 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white group-hover:text-ksp-red transition-colors duration-500">Samsung Galaxy</h3>
              <p className="text-gray-100 text-sm group-hover:text-white transition-colors duration-500">Foldables & S-Series</p>
            </div>
          </Link>

          {/* Small Cards */}
          <Link to="/products?brand=xiaomi" className="relative group overflow-hidden rounded-3xl border border-gray-400 hover:border-ksp-red/50 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105" style={{ backgroundImage: 'url(/images/xiaomi-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', perspective: '1000px' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.transform = `scale(1.01) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)'; }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
            <div className="absolute inset-0 group-hover:bg-ksp-red/10 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8 flex flex-col items-start text-left">
              <h3 className="font-bold text-2xl text-white group-hover:text-ksp-red transition-colors duration-500">Xiaomi</h3>
              <p className="text-xs text-gray-100 mt-1 group-hover:text-white transition-colors duration-500">Power meets Value</p>
            </div>
          </Link>

          <Link to="/products?brand=oneplus" className="relative group overflow-hidden rounded-3xl border border-gray-400 hover:border-ksp-red/50 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105" style={{ backgroundImage: 'url(/images/infinix-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', perspective: '1000px' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.transform = `scale(1.01) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)'; }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
            <div className="absolute inset-0 group-hover:bg-ksp-red/10 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8 flex flex-col items-start text-left">
              <h3 className="font-bold text-2xl text-white group-hover:text-ksp-red transition-colors duration-500">Infinix</h3>
              <p className="text-xs text-gray-100 mt-1 group-hover:text-white transition-colors duration-500">The Future is Now</p>
            </div>
          </Link>
        </div>
      </section>

      {/* --- QUICK BROWSE CATEGORIES --- */}
      <section className="container mx-auto px-6 py-16 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">Browse by Category</h2>
            <p className="text-gray-600 mt-2">Find your perfect device.</p>
          </div>
          <Link to="/products" className="text-ksp-red font-semibold flex items-center gap-2 hover:underline">
            View all categories <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Phones", bg: "url(/images/phones-bg.jpg)" },
            { name: "Tablets", bg: "url(/images/tablets-bg.jpg)" },
            { name: "Earbuds", bg: "url(/images/earbuds-bg.jpg)" },
            { name: "Accessories", bg: "url(/images/accessories-bg.jpg)" }
          ].map((category, i) => (
            <Link key={i} to={`/products?category=${category.name.toLowerCase()}`} className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-md border border-white/30 cursor-pointer shadow-md hover:shadow-lg hover:border-ksp-red/50 transition-all duration-500 transform hover:scale-105 h-56" style={{ backgroundImage: category.bg, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
              <div className="absolute inset-0 group-hover:bg-ksp-red/10 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col items-center justify-end h-full text-center">
                <h3 className="text-2xl font-bold text-white group-hover:text-ksp-red transition-colors duration-500">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- AUTHORIZED BRANDS SECTION --- */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Authorized Dealer for Leading Mobile Brands</h2>
          <p className="text-gray-600 text-lg">We are proud partners of the world's most trusted mobile manufacturers.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: "Apple", logo: "/images/brands/apple-logo.png", bg: "#ffffff" },
            { name: "Samsung", logo: "/images/brands/samsung-logo.png", bg: "#ffffff" },
            { name: "Xiaomi", logo: "/images/brands/xiaomi-logo.png", bg: "#ffffff" },
            { name: "Infinix", logo: "/images/brands/infinix-logo.png", bg: "#000000" },
            { name: "Huawei", logo: "/images/brands/huawei-logo.png", bg: "#ffffff" },
            { name: "POCO", logo: "/images/brands/poco-logo.png", bg: "#FFD401" },
            { name: "Realme", logo: "/images/brands/realme-logo.png", bg: "#FFC916" },
            { name: "Vivo", logo: "/images/brands/vivo-logo.png", bg: "#415FFF" },
            { name: "JBL", logo: "/images/brands/jbl-logo.png", bg: "#DC381D" },
            { name: "Soundcore", logo: "/images/brands/soundcore-logo.png", bg: "#ffffff" }
          ].map((brand, i) => (
            <div key={i} className="group h-32 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200 hover:border-ksp-red/50" style={{ backgroundColor: brand.bg }}>
              <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-20 border-t border-gray-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Happy Clients", val: "10K+" },
              { label: "Phone Models", val: "500+" },
              { label: "Active Brands", val: "50+" },
              { label: "Support Rate", val: "99.9%" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-black text-ksp-red mb-2">{stat.val}</div>
                <div className="text-gray-600 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6" style={{ backgroundColor: '#c4c4c4' }}>
        <div className="container mx-auto relative rounded-[40px] overflow-hidden bg-ksp-red p-12 md:p-20 text-center">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">UPGRADE YOUR GEAR.</h2>
            <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join our newsletter or browse our clearance sale to get up to 15% off on selected flagship models.
            </p>
            <Link to="/products" className="inline-flex items-center gap-3 bg-white text-ksp-red px-10 py-5 rounded-full font-black text-lg hover:shadow-2xl hover:scale-105 transition-all">
              SHOP DEALS NOW <Smartphone size={22} />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;