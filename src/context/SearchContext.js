import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { listingService } from '../services/listingService';
import { searchService } from '../services/searchService';
import { dnaService } from '../services/dnaService';
import toast from 'react-hot-toast';
import { Check, X, AlertCircle } from 'lucide-react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
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

  // Load default recent listings (e.g., for initial page view)
  const loadDefaultListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listingService.getListings({ limit: 12 });
      setResults(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Error loading default listings:', error);
      showBrutalistToast('Failed to load listings', 'error');
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
          // Not user‑visible – keep console only
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      showBrutalistToast('Search failed', 'error');
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
      showBrutalistToast('Search saved', 'success');
      return saved;
    } catch (error) {
      console.error('Error saving search:', error);
      showBrutalistToast('Failed to save search', 'error');
      throw error;
    }
  };

  const loadSavedSearches = async () => {
    try {
      const data = await searchService.getSavedSearches();
      setSavedSearches(data);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      showBrutalistToast('Failed to load saved searches', 'error');
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
    loadDefaultListings,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};