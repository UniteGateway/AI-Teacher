import React from 'react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
        <div className="bg-green-600/20 text-green-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AdCreativeCard: React.FC<{ imgSrc: string; title: string; status: 'Active' | 'Paused' }> = ({ imgSrc, title, status }) => (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
        <img src={imgSrc} alt={title} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h4 className="font-semibold text-white truncate">{title}</h4>
            <div className="flex justify-between items-center mt-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {status}
                </span>
                <a href="#" className="text-sm text-indigo-400 hover:underline">Manage</a>
            </div>
        </div>
    </div>
);

const AdvertiserDashboard: React.FC = () => {
  return (
    <div className="p-8 text-white space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Advertiser Dashboard</h1>
        <p className="text-lg text-gray-400">
            Manage ad campaigns, view performance metrics, and update your creatives.
        </p>
      </div>

       {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Spend" value="$5,420.50" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} />
        <StatCard title="Impressions" value="1.2M" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} />
        <StatCard title="Click-Through Rate" value="2.81%" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard title="Conversions" value="842" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>} />
      </div>

      {/* Campaign Performance Chart */}
       <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Performance (Last 7 Days)</h3>
            <div className="h-80 bg-gray-700/50 rounded-lg p-4 flex items-end gap-4">
                { [60, 80, 50, 90, 70, 110, 130].map((height, i) => (
                    <div key={i} className="flex-1 bg-green-500 rounded-t-md" style={{height: `${height}px`}} title={`Day ${i+1}`}></div>
                ))}
            </div>
        </div>

      {/* Ad Creatives */}
      <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Active Ad Creatives</h2>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Upload New Creative</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdCreativeCard 
                imgSrc="https://images.unsplash.com/photo-1555066931-4365d1469c9b?q=80&w=2070&auto=format&fit=crop"
                title="Code Masters Bootcamp"
                status="Active"
            />
             <AdCreativeCard 
                imgSrc="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1971&auto=format&fit=crop"
                title="Creative Writing Workshop"
                status="Active"
            />
             <AdCreativeCard 
                imgSrc="https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop"
                title="Math Genius Tutoring"
                status="Paused"
            />
            <AdCreativeCard 
                imgSrc="https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=2070&auto=format&fit=crop"
                title="Language Learning App"
                status="Active"
            />
        </div>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;