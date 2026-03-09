import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';                // 👈 added
import { searchService } from '../services/searchService';
import { dnaService } from '../services/dnaService';      // 👈 added

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};

export const SearchProvider = ({ children }) => {
  const { user } = useAuth();                              // 👈 get current user
  const [filters, setFilters] = useState({
    // Basic
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    category: '',

    // Deal breakers (exclude)
    dealBreakers: [],

    // Must-haves (require)
    mustHaves: [],

    // Trim
    trim: '',

    // Additional
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

  // Execute search
  const executeSearch = useCallback(async (searchFilters = filters, query = searchQuery) => {
    setLoading(true);
    try {
      const data = await searchService.searchListings({
        ...searchFilters,
        query,
      });
      setResults(data);
      setTotalCount(data.length);

      // 👇 Record search for DNA (only if user is logged in)
      if (user) {
        try {
          await dnaService.recordSearch({ ...searchFilters, query }, data.length);
        } catch (dnaError) {
          console.error('Failed to record search for DNA:', dnaError);
          // Non‑blocking – don't affect user experience
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, user]);                         // 👈 added user dependency

  // Save current search
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

  // Load saved searches for current user
  const loadSavedSearches = async () => {
    try {
      const data = await searchService.getSavedSearches();
      setSavedSearches(data);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  // Clear all filters
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
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};