import React, { useEffect } from 'react';
import ListingDetail from '../components/listings/ListingDetail';

const ListingPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300">
      <ListingDetail />
    </div>
  );
};

export default ListingPage;