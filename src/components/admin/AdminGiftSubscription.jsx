import React, { useState } from 'react';
import { dealerService } from '../../services/dealerService';
import { subscriptionService } from '../../services/subscriptionService';
import { Search, User, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminGiftSubscription = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [plan, setPlan] = useState('pro');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await dealerService.searchDealers(searchQuery);
      setDealers(results);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDealer = (dealer) => {
    setSelectedDealer(dealer);
    setDealers([]);
    setSearchQuery('');
  };

  const handleGrant = async () => {
    if (!selectedDealer) {
      toast.error('Please select a dealer');
      return;
    }
    setLoading(true);
    try {
      await subscriptionService.adminGrantSubscription(selectedDealer.id, plan, duration);
      toast.success(`Gifted ${plan} plan to ${selectedDealer.business_name}`);
      setSelectedDealer(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Gift className="w-5 h-5 mr-2 text-purple-600" />
        Gift a Subscription
      </h2>

      {/* Search dealer */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Find Dealer by name, phone or email
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. 08012345678"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Search results */}
      {dealers.length > 0 && (
        <div className="mb-4 border rounded-md divide-y max-h-60 overflow-y-auto">
          {dealers.map((dealer) => (
            <button
              key={dealer.id}
              onClick={() => handleSelectDealer(dealer)}
              className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-3"
            >
              <User size={20} className="text-gray-400" />
              <div>
                <p className="font-medium">{dealer.business_name}</p>
                <p className="text-sm text-gray-500">{dealer.phone} • {dealer.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected dealer */}
      {selectedDealer && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium">{selectedDealer.business_name}</p>
            <p className="text-sm text-gray-600">{selectedDealer.phone}</p>
          </div>
          <button
            onClick={() => setSelectedDealer(null)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Change
          </button>
        </div>
      )}

      {/* Plan and duration */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pro">Pro (₦5,000/month)</option>
            <option value="enterprise">Enterprise (₦12,000/month)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={1}>1 month</option>
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGrant}
        disabled={!selectedDealer || loading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
      >
        <Gift size={18} className="mr-2" />
        {loading ? 'Granting...' : 'Grant Gift Subscription'}
      </button>
    </div>
  );
};

export default AdminGiftSubscription;