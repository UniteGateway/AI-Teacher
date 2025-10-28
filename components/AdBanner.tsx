import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop" 
            alt="Abstract background"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent"></div>
      </div>
      <div className="p-4 -mt-16 relative">
          <h4 className="text-lg font-bold text-white">Unlock Your Full Potential</h4>
          <p className="mt-1 text-sm text-gray-300">
            Get 25% off our annual subscription for Nuro Premium for unlimited access!
          </p>
          <button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2 px-4 rounded-full transition-colors w-full">
            Upgrade Now
          </button>
      </div>
    </div>
  );
};

export default AdBanner;
