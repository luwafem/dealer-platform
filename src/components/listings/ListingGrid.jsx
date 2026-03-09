import React from 'react';
import ListingCard from './ListingCard';
import { SearchX, Loader2 } from 'lucide-react';

const ListingGrid = ({ listings, loading, emptyMessage = 'No matching registry entries found' }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Loader2 className="animate-spin text-black mb-4" size={48} strokeWidth={3} />
        <span className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Synchronizing Database...
        </span>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-20 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
        <div className="bg-black p-4 mb-4">
            <SearchX className="text-white" size={32} />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Zero Results</h3>
        <p className="text-xs font-bold uppercase tracking-widest max-w-xs mx-auto opacity-80">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {listings.map((listing) => (
        <div key={listing.id} className="transition-transform hover:-translate-y-1">
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;