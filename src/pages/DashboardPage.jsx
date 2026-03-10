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
      {/* Header / Tabs - flat, no shadows */}
      <div className="border-b-2 border-black bg-[#f4f4f2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('seller')}
              className={`py-4 px-6 font-black uppercase text-sm tracking-tighter flex items-center border-2 border-black border-b-0 ${
                activeTab === 'seller'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-yellow-400 hover:text-black transition-colors'
              }`}
            >
              <ShoppingBag size={18} className="mr-2" strokeWidth={2} />
              Seller
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-4 px-6 font-black uppercase text-sm tracking-tighter flex items-center border-2 border-black border-l-0 border-b-0 ${
                activeTab === 'buyer'
                  ? 'bg-black text-white'
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