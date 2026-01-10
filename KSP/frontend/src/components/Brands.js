import React from 'react';

const Brands = () => {
  const brands = [
    { name: 'Apple', logo: 'apple', bgColor: 'bg-white', textColor: 'text-black' },
    { name: 'Samsung', logo: 'samsung', bgColor: 'bg-white', textColor: 'text-blue-600' },
    { name: 'Xiaomi', logo: 'xiaomi', bgColor: 'bg-white', textColor: 'text-orange-500' },
    { name: 'Infinix', logo: 'infinix', bgColor: 'bg-black', textColor: 'text-white' },
    { name: 'Huawei', logo: 'huawei', bgColor: 'bg-white', textColor: 'text-red-600' },
    { name: 'Poco', logo: 'poco', bgColor: 'bg-yellow-400', textColor: 'text-black' },
    { name: 'Realme', logo: 'realme', bgColor: 'bg-yellow-400', textColor: 'text-black' },
    { name: 'Vivo', logo: 'vivo', bgColor: 'bg-blue-600', textColor: 'text-white' },
    { name: 'JBL', logo: 'jbl', bgColor: 'bg-red-600', textColor: 'text-white' },
    { name: 'Other', logo: 'other', bgColor: 'bg-white', textColor: 'text-blue-500' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Shop by Brand
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={`${brand.bgColor} ${brand.textColor} rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex items-center justify-center h-32 sm:h-36 md:h-40`}
            >
              <div className="text-center p-4">
                {brand.logo === 'apple' && (
                  <div className="text-5xl">
                    <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  </div>
                )}
                {brand.logo === 'samsung' && (
                  <div className="text-3xl font-bold tracking-wider">SAMSUNG</div>
                )}
                {brand.logo === 'xiaomi' && (
                  <div>
                    <div className="bg-orange-500 rounded-lg w-12 h-12 mx-auto flex items-center justify-center mb-2">
                      <span className="text-white text-2xl font-bold">mi</span>
                    </div>
                    <div className="text-gray-600 text-sm font-medium">XIAOMI</div>
                  </div>
                )}
                {brand.logo === 'infinix' && (
                  <div className="text-xl font-bold tracking-widest">Infinix</div>
                )}
                {brand.logo === 'huawei' && (
                  <div>
                    <div className="text-red-600 text-4xl mb-1">⚙</div>
                    <div className="text-gray-800 text-xl font-bold tracking-wide">HUAWEI</div>
                  </div>
                )}
                {brand.logo === 'poco' && (
                  <div className="text-4xl font-black tracking-wider">POCO</div>
                )}
                {brand.logo === 'realme' && (
                  <div className="text-4xl font-semibold">realme</div>
                )}
                {brand.logo === 'vivo' && (
                  <div className="text-4xl font-light tracking-widest">vivo</div>
                )}
                {brand.logo === 'jbl' && (
                  <div className="text-5xl font-black tracking-wider">JBL</div>
                )}
                {brand.logo === 'other' && (
                  <div>
                    <div className="text-5xl">🎵</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
