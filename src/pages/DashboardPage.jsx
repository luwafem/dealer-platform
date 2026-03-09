import React, { useState, useEffect } from 'react';
import SellerDashboard from '../components/profile/SellerDashboard';
import BuyerDashboard from '../components/profile/BuyerDashboard';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('seller');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300">
      {/* Header / Tabs */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('seller')}
              className={`py-4 px-6 font-black uppercase text-sm tracking-tighter flex items-center border-2 border-black -mb-0.5 ${
                activeTab === 'seller'
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10'
                  : 'bg-white text-black hover:bg-yellow-400 hover:text-black transition-colors'
              }`}
            >
              <ShoppingBag size={18} className="mr-2" strokeWidth={2} />
              Seller
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-4 px-6 font-black uppercase text-sm tracking-tighter flex items-center border-2 border-black -mb-0.5 ${
                activeTab === 'buyer'
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10'
                  : 'bg-white text-black hover:bg-yellow-400 hover:text-black transition-colors'
              }`}
            >
              <ShoppingCart size={18} className="mr-2" strokeWidth={2} />
              Buyer
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'seller' ? <SellerDashboard /> : <BuyerDashboard />}
      </div>
    </div>
  );
};

export default DashboardPage;