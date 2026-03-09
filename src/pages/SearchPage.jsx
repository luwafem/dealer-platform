import React, { useEffect, useRef } from 'react';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import { useSearch } from '../context/SearchContext';

const SearchPage = () => {
  const { results, filters, searchQuery, loadDefaultListings, loading } = useSearch();
  const hasLoadedDefault = useRef(false);

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
    <div>
      <SearchBar />
      <SearchResults />
    </div>
  );
};

export default SearchPage;