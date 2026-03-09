import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { listingService } from '../services/listingService';   // 👈 new import
import { searchService } from '../services/searchService';
import { dnaService } from '../services/dnaService';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};

export const SearchProvider = ({ children }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    category: '',
    dealBreakers: [],
    mustHaves: [],
    trim: '',
    engineType: '',
    transmission: '',
    mileageMax: '',
    accidentHistory: '',
    customsStatus: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [savedSearches, setSavedSearches] = useState([]);

  // 👇 NEW: Load default recent listings (e.g., for initial page view)
  const loadDefaultListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listingService.getListings({ limit: 12 }); // adjust limit as needed
      setResults(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Error loading default listings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSearch = useCallback(async (searchFilters = filters, query = searchQuery) => {
    setLoading(true);
    try {
      const data = await searchService.searchListings({
        ...searchFilters,
        query,
      });
      setResults(data);
      setTotalCount(data.length);

      if (user) {
        try {
          await dnaService.recordSearch({ ...searchFilters, query }, data.length);
        } catch (dnaError) {
          console.error('Failed to record search for DNA:', dnaError);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, user]);

  const saveCurrentSearch = async (name) => {
    try {
      const saved = await searchService.saveSearch({
        name,
        criteria: {
          filters,
          query: searchQuery,
        },
      });
      setSavedSearches(prev => [...prev, saved]);
      return saved;
    } catch (error) {
      throw error;
    }
  };

  const loadSavedSearches = async () => {
    try {
      const data = await searchService.getSavedSearches();
      setSavedSearches(data);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      category: '',
      dealBreakers: [],
      mustHaves: [],
      trim: '',
      engineType: '',
      transmission: '',
      mileageMax: '',
      accidentHistory: '',
      customsStatus: '',
    });
    setSearchQuery('');
  };

  const value = {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    results,
    loading,
    totalCount,
    executeSearch,
    saveCurrentSearch,
    savedSearches,
    loadSavedSearches,
    clearFilters,
    loadDefaultListings,   // 👈 expose the new function
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};