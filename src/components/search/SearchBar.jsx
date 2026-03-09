import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { useNavigate } from 'react-router-dom'; // 👈 import
import AdvancedFilters from './AdvancedFilters';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, executeSearch, clearFilters, filters } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate(); // 👈 use navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();      // update context
    navigate('/search');  // go to search page
  };

  const handleClear = () => {
    setSearchQuery('');
    clearFilters();
    executeSearch({}, '');
    navigate('/search');
  };

  return (
    <>
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make, model, or keyword..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
            {(searchQuery || Object.values(filters).some(v => v)) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            )}
          </form>
        </div>
      </div>

      <AdvancedFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </>
  );
};

export default SearchBar;