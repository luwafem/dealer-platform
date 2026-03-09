import { useState, useEffect } from 'react';
import { listingService } from '../services/listingService';

export const useListings = (initialFilters = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await listingService.getListings(filters);
      setListings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchListings();
  };

  return {
    listings,
    loading,
    error,
    filters,
    setFilters,
    refetch,
  };
};

// Hook for a single listing
export const useListing = (id) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await listingService.getListingById(id);
      setListing(data);
      // Increment view count
      await listingService.incrementViews(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { listing, loading, error, refetch: fetchListing };
};