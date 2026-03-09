import React, { useEffect, useState } from 'react';
import { listingService } from '../services/listingService';
import ListingGrid from '../components/listings/ListingGrid';
import { AlertTriangle } from 'lucide-react';

const DistressPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadDistress = async () => {
      try {
        const data = await listingService.getListings({ is_distress: true });
        setListings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDistress();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Distress <br /> Sales
            </h1>
          </div>
          <p className="text-lg font-medium border-l-4 border-black pl-4">
            Urgent sales – sellers are motivated to sell quickly
          </p>
        </div>

        {/* Results */}
        <ListingGrid listings={listings} loading={loading} />
      </div>
    </div>
  );
};

export default DistressPage;