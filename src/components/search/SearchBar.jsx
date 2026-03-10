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
      <div className="bg-[#f4f4f2] py-2">
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col md:flex-row items-stretch gap-0 border-2 border-black bg-[#f4f4f2]"
          >
            {/* Input Field Area */}
            <div className="flex-1 relative border-b-2 md:border-b-0 md:border-r-2 border-black group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-yellow-500 transition-colors">
                <Search size={18} strokeWidth={3} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH MAKE, MODEL, OR VIN..."
                className="w-full pl-12 pr-4 py-4 md:py-5 bg-transparent text-[11px] md:text-xs font-black uppercase tracking-widest placeholder:text-slate-400 focus:outline-none"
              />
              
              {/* Mobile Clear Button - Inside the input for space saving */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden text-red-600"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="px-6 py-4 flex items-center justify-center space-x-2 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-yellow-400 transition-colors group"
            >
              <SlidersHorizontal size={16} strokeWidth={3} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">Filters</span>
            </button>

            {/* Desktop Clear Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="hidden md:flex px-4 items-center justify-center border-r-2 border-black hover:bg-red-500 hover:text-white transition-colors"
                title="Reset All"
              >
                <X size={18} strokeWidth={3} />
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="px-8 py-4 bg-black text-white hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center group"
            >
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mr-2">Execute</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          {/* Active Filter Indicator - Minimal Line */}
          {hasActiveFilters && (
            <div className="mt-2 flex items-center px-1 md:px-0">
              <span className="text-[9px] font-black uppercase text-red-600 tracking-[0.2em]">
                Active Filters Applied
              </span>
              <div className="ml-3 h-[2px] flex-grow bg-black"></div>
            </div>
          )}
        </div>
      </div>

      <AdvancedFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </>
  );
};

export default SearchBar;