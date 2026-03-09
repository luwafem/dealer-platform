import React, { useState } from 'react';
import SellerDashboard from '../components/profile/SellerDashboard';
import BuyerDashboard from '../components/profile/BuyerDashboard';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('seller');

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          <button
            onClick={() => setActiveTab('seller')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'seller'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag size={18} className="mr-2" />
            Seller
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'buyer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingCart size={18} className="mr-2" />
            Buyer
          </button>
        </nav>
      </div>

      {activeTab === 'seller' ? <SellerDashboard /> : <BuyerDashboard />}
    </div>
  );
};

export default DashboardPage;