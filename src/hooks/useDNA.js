import { useState, useEffect } from 'react';
import { dnaService } from '../services/dnaService';
import { useAuth } from './useAuth';

export const useDNA = () => {
  const { user } = useAuth();
  const [dna, setDNA] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDNA();
      loadInsights();
    } else {
      setDNA(null);
      setInsights([]);
      setLoading(false);
    }
  }, [user]);

  const loadDNA = async () => {
    try {
      setLoading(true);
      const data = await dnaService.getDealerDNA();
      setDNA(data);
    } catch (error) {
      console.error('Error loading DNA:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const data = await dnaService.getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const recordSearch = async (filters, resultsCount) => {
    if (!user) return;
    await dnaService.recordSearch(filters, resultsCount);
    // Refresh DNA after search
    loadDNA();
    loadInsights();
  };

  return {
    dna,
    insights,
    loading,
    recordSearch,
    refresh: loadDNA,
  };
};