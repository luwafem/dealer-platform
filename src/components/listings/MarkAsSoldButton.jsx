import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSold } from '../../hooks/useSold';
import { whatsappService } from '../../services/whatsappService';
import { AlertCircle, User, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MarkAsSoldButton = ({ listing }) => {
  const { user, dealer } = useAuth();
  const { markAsSold, loading } = useSold();
  const [showModal, setShowModal] = useState(false);
  const [buyer, setBuyer] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [loadingBuyers, setLoadingBuyers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks before any conditional returns
  useEffect(() => {
    if (showModal) {
      loadPotentialBuyers();
    }
  }, [showModal]);

  // Early returns after all hooks
  if (!user || dealer?.id !== listing.dealer_id) return null;
  if (listing.status !== 'available') return null;

  const loadPotentialBuyers = async () => {
    setLoadingBuyers(true);
    try {
      const data = await whatsappService.getPotentialBuyers(listing.id, dealer.id);
      setBuyers(data);
    } catch (error) {
      console.error('Error loading buyers:', error);
    } finally {
      setLoadingBuyers(false);
    }
  };

  const handleMarkSold = async () => {
    try {
      await markAsSold(listing.id, buyer?.id);
      toast.success('Car marked as sold!');
      setShowModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredBuyers = buyers.filter(b => 
    b.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        Mark as Sold
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Mark as Sold</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the buyer (optional) so they can rate you. If you don't select, the sale will still be recorded.
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {loadingBuyers ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <button
                  onClick={() => setBuyer(null)}
                  className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center space-x-3 ${
                    !buyer ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                >
                  <User size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium">Skip (no buyer)</p>
                    <p className="text-sm text-gray-500">Sale will be recorded without a buyer</p>
                  </div>
                </button>
                {filteredBuyers.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBuyer(b)}
                    className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center space-x-3 ${
                      buyer?.id === b.id ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                  >
                    <User size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{b.business_name}</p>
                      <p className="text-sm text-gray-500">{b.phone}</p>
                    </div>
                  </button>
                ))}
                {filteredBuyers.length === 0 && (
                  <p className="text-center text-gray-500 py-2">No potential buyers found</p>
                )}
              </div>
            )}

            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleMarkSold}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Sale'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkAsSoldButton;