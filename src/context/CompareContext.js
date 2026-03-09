import React, { createContext, useState, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};

export const CompareProvider = ({ children }) => {
  const [selectedListings, setSelectedListings] = useState([]);
  const MAX_COMPARE = 4;

  const addToList = useCallback((listing) => {
    setSelectedListings(prev => {
      // Check if already in list
      if (prev.some(l => l.id === listing.id)) {
        toast.error('This listing is already in comparison');
        return prev;
      }
      if (prev.length >= MAX_COMPARE) {
        toast.error(`You can compare up to ${MAX_COMPARE} cars`);
        return prev;
      }
      toast.success('Added to comparison');
      return [...prev, listing];
    });
  }, []);

  const removeFromList = useCallback((listingId) => {
    setSelectedListings(prev => prev.filter(l => l.id !== listingId));
    toast.success('Removed from comparison');
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