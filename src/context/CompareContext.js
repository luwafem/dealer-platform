import React, { createContext, useState, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Check, X, AlertCircle } from 'lucide-react';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};

// Brutalist toast helper
const showBrutalistToast = (message, type = 'success') => {
  const icons = {
    success: <Check size={20} strokeWidth={3} className="text-black" />,
    error: <X size={20} strokeWidth={3} className="text-black" />,
    warning: <AlertCircle size={20} strokeWidth={3} className="text-black" />
  };

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 max-w-md w-full`}
      >
        <div className={`flex-shrink-0 ${type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-black uppercase text-sm tracking-tighter">{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="flex-shrink-0 border-2 border-black p-1 hover:bg-yellow-400 transition-colors">
          <X size={14} strokeWidth={3} />
        </button>
      </div>
    ),
    {
      duration: 3000,
      position: 'top-center',
    }
  );
};

export const CompareProvider = ({ children }) => {
  const [selectedListings, setSelectedListings] = useState([]);
  const MAX_COMPARE = 4;

  const addToList = useCallback((listing) => {
    setSelectedListings(prev => {
      // Check if already in list
      if (prev.some(l => l.id === listing.id)) {
        showBrutalistToast('Already in comparison', 'warning');
        return prev;
      }
      if (prev.length >= MAX_COMPARE) {
        showBrutalistToast(`Max ${MAX_COMPARE} cars`, 'error');
        return prev;
      }
      showBrutalistToast('Added to comparison', 'success');
      return [...prev, listing];
    });
  }, []);

  const removeFromList = useCallback((listingId) => {
    setSelectedListings(prev => prev.filter(l => l.id !== listingId));
    showBrutalistToast('Removed from comparison', 'success');
  }, []);

  const clearList = useCallback(() => {
    setSelectedListings([]);
  }, []);

  const isSelected = useCallback((listingId) => {
    return selectedListings.some(l => l.id === listingId);
  }, [selectedListings]);

  const value = {
    selectedListings,
    addToList,
    removeFromList,
    clearList,
    isSelected,
    maxCompare: MAX_COMPARE,
    count: selectedListings.length,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};