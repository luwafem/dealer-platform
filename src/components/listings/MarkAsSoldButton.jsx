import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSold } from '../../hooks/useSold';
import { whatsappService } from '../../services/whatsappService';
import { AlertCircle, User, Search, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MarkAsSoldButton = ({ listing }) => {
  const { user, dealer } = useAuth();
  const { markAsSold, loading } = useSold();
  const [showModal, setShowModal] = useState(false);
  const [buyer, setBuyer] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [loadingBuyers, setLoadingBuyers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (showModal) {
      loadPotentialBuyers();
    }
  }, [showModal]);

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
      toast.success('REGISTRY UPDATED: Vehicle Sold');
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
        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-400 text-black border-2 border-black font-black uppercase text-xs hover:bg-emerald-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
      >
        <CheckCircle size={16} strokeWidth={3} />
        Mark as Sold
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#f4f4f2] border-4 border-black p-6 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Confirm Liquidation</h3>
              <button onClick={() => setShowModal(false)} className="p-1 border-2 border-black hover:bg-red-500 hover:text-white transition-colors">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <p className="text-[10px] font-black uppercase text-slate-600 mb-6 leading-tight">
              Select the acquiring party to permit rating synchronization. If bypassed, the sale remains anonymous in the registry.
            </p>

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="SEARCH ACQUIRING PARTIES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-4 border-black font-bold uppercase text-xs focus:outline-none focus:bg-yellow-50"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-black" strokeWidth={3} />
            </div>

            {loadingBuyers ? (
              <div className="text-center py-8 font-black animate-pulse">SCANNING DATABASE...</div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => setBuyer(null)}
                  className={`w-full text-left p-4 border-2 border-black flex items-center space-x-4 transition-all ${
                    !buyer ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  <User size={24} strokeWidth={3} />
                  <div>
                    <p className="font-black uppercase text-xs">Skip / Anonymous</p>
                    <p className="text-[10px] font-bold opacity-70">RECORD WITHOUT BUYER DATA</p>
                  </div>
                </button>

                {filteredBuyers.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBuyer(b)}
                    className={`w-full text-left p-4 border-2 border-black flex items-center space-x-4 transition-all ${
                      buyer?.id === b.id ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    <User size={24} strokeWidth={3} />
                    <div>
                      <p className="font-black uppercase text-xs">{b.business_name}</p>
                      <p className="text-[10px] font-bold opacity-70">{b.phone}</p>
                    </div>
                  </button>
                ))}

                {filteredBuyers.length === 0 && searchTerm && (
                  <p className="text-center text-[10px] font-black uppercase py-4 text-red-500">No records match your query</p>
                )}
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={handleMarkSold}
                disabled={loading}
                className="bg-black text-white py-4 border-2 border-black font-black uppercase text-xs hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
              >
                {loading ? 'SYNCING...' : 'Confirm Sale'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white text-black py-4 border-2 border-black font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkAsSoldButton;