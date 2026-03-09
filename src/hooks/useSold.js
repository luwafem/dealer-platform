import { useState } from 'react';
import { soldService } from '../services/soldService';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useSold = () => {
  const { user, refreshDealer } = useAuth();
  const [loading, setLoading] = useState(false);

  const markAsSold = async (listingId, buyerId = null) => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    try {
      await soldService.markAsSold(listingId, buyerId);
      await refreshDealer(); // update dealer stats (paid_deals, badge)
      toast.success('Car marked as sold!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSoldHistory = async (dealerId) => {
    try {
      return await soldService.getSoldHistory(dealerId);
    } catch (error) {
      toast.error(error.message);
      return [];
    }
  };

  const getBoughtHistory = async (dealerId) => {
    try {
      return await soldService.getBoughtHistory(dealerId);
    } catch (error) {
      toast.error(error.message);
      return [];
    }
  };

  return {
    markAsSold,
    getSoldHistory,
    getBoughtHistory,
    loading,
  };
};