import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Award, Users, ShieldCheck, Truck } from 'lucide-react';

const About = () => {
  // Default about us content - in production this would come from backend/localStorage
  const [aboutData, setAboutData] = useState({
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

  useEffect(() => {
    // Load saved about data from localStorage
    const savedData = localStorage.getItem('aboutUsData');
    if (savedData) {
      setAboutData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#c4c4c4', fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{aboutData.storeName}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{aboutData.tagline}</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: 'Years in Business', value: aboutData.yearsInBusiness },
            { icon: Users, label: 'Happy Customers', value: aboutData.happyCustomers },
            { icon: Award, label: 'Brands Available', value: aboutData.brandsAvailable },
            { icon: ShieldCheck, label: 'Warranty Support', value: aboutData.warrantySupport }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-ksp-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-ksp-red" size={24} />
                </div>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Content */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Story */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{aboutData.description}</p>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">{aboutData.mission}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600">{aboutData.vision}</p>
            </div>
          </div>

          {/* Right - Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ksp-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-ksp-red" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Visit Our Store</h4>
                    <p className="text-gray-600">{aboutData.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ksp-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-ksp-red" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                    <p className="text-gray-600">{aboutData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ksp-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-ksp-red" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                    <p className="text-gray-600">{aboutData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ksp-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-ksp-red" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Working Hours</h4>
                    <p className="text-gray-600">{aboutData.workingHours}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Map Integration Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Genuine', desc: 'All products are authentic with manufacturer warranty' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Island-wide delivery within 2-3 business days' },
              { icon: Award, title: 'Best Prices', desc: 'Competitive prices with price match guarantee' },
              { icon: Users, title: 'Expert Support', desc: '24/7 customer support for all your queries' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center p-6">
                  <div className="w-16 h-16 bg-ksp-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-ksp-red" size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
