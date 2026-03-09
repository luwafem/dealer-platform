import React, { useEffect, useState } from 'react';
import { listingService } from '../services/listingService';
import ListingGrid from '../components/listings/ListingGrid';
import { AlertTriangle } from 'lucide-react';

const DistressPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
        <h1 className="text-2xl font-bold">Distress Sales</h1>
      </div>
      <p className="text-gray-600 mb-8">
        These listings are marked as urgent sales – sellers are motivated to sell quickly.
      </p>
      <ListingGrid listings={listings} loading={loading} />
    </div>
  );
};

export default DistressPage;