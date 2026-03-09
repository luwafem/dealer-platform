import React from 'react';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';

const SearchPage = () => {
  return (
    <div>
      <SearchBar />
      <SearchResults />
    </div>
  );
};

export default SearchPage;