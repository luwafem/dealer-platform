import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import AdvancedFilters from './AdvancedFilters';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, executeSearch, clearFilters, filters } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
    navigate('/search');
  };

  const handleClear = () => {
    setSearchQuery('');
    clearFilters();
    executeSearch({}, '');
    navigate('/search');
  };

  const hasActiveFilters = searchQuery || Object.values(filters).some(v => v);

  return (
    <>
      <div className="bg-transparent py-4">
        <div className="max-w-7xl mx-auto px-4">
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col md:flex-row items-stretch gap-0 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-[4px] focus-within:translate-y-[4px]"
          >
            {/* Input Field Area */}
            <div className="flex-1 relative border-b-2 md:border-b-0 md:border-r-2 border-black group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-yellow-500 transition-colors">
                <Search size={20} strokeWidth={3} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="REGISTRY SEARCH: MAKE, MODEL, OR VIN..."
                className="w-full pl-12 pr-4 py-4 bg-transparent text-xs font-black uppercase tracking-widest placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="px-6 py-4 flex items-center justify-center space-x-2 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-yellow-400 transition-colors group"
            >
              <SlidersHorizontal size={18} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-tighter">Adjust Filters</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-8 py-4 bg-black text-white hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center group"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] mr-2">Execute</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Clear Button - Absolute pinned to the top right of the bar on mobile or end on desktop */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-600 text-white px-4 flex items-center justify-center border-l-0 md:border-l-2 border-black hover:bg-black transition-colors"
                title="Reset All"
              >
                <X size={20} strokeWidth={3} />
              </button>
            )}
          </form>
          
          {/* Active Filter Indicator - Small "Tag" */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center">
              <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">
                Active Session
              </span>
              <div className="ml-2 h-[2px] flex-grow bg-black opacity-10"></div>
            </div>
          )}
        </div>
      </div>

      <AdvancedFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </>
  );
};

export default SearchBar;