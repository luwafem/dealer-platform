import React, { useEffect, useRef } from 'react';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import { useSearch } from '../context/SearchContext';

const SearchPage = () => {
  const { results, filters, searchQuery, loadDefaultListings, loading } = useSearch();
  const hasLoadedDefault = useRef(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Helper to check if a filter value is empty
    const isEmpty = (value) => {
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'string') return value === '';
      return !value; // for other types (numbers, booleans, etc.)
    };

    const allFiltersEmpty = Object.values(filters).every(isEmpty);

    // Load default listings only once when conditions are met
    if (!loading && results.length === 0 && !searchQuery && allFiltersEmpty && !hasLoadedDefault.current) {
      hasLoadedDefault.current = true;
      loadDefaultListings();
    }
  }, [loading, results.length, searchQuery, filters, loadDefaultListings]);

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Search <br /> Inventory
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Find the perfect vehicle for your lot
          </p>
        </div>

        {/* Search Bar – should already be styled with brutalist elements */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Results */}
        <SearchResults />
      </div>
    </div>
  );
};

export default SearchPage;