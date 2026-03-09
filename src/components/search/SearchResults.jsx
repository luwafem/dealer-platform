import React from 'react';
import { useSearch } from '../../context/SearchContext';
import ListingGrid from '../listings/ListingGrid';

const SearchResults = () => {
  const { results, loading, totalCount } = useSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {totalCount} {totalCount === 1 ? 'Listing' : 'Listings'} Found
        </h2>
      </div>
      <ListingGrid listings={results} loading={loading} />
    </div>
  );
};

export default SearchResults;