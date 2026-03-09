import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { listingService } from '../services/listingService';
import CompareTable from '../components/compare/CompareTable';
import Loader from '../components/common/Loader';
import { ArrowLeft } from 'lucide-react';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length < 2) {
      setLoading(false);
      return;
    }
    const fetchListings = async () => {
      try {
        const promises = ids.map(id => listingService.getListingById(id));
        const results = await Promise.all(promises);
        setListings(results);
      } catch (error) {
        console.error('Error loading compare listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchParams]);

  if (loading) return <Loader />;

  if (listings.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Not enough cars to compare</h2>
        <p className="text-gray-600 mb-8">Please select at least 2 cars to compare.</p>
        <Link to="/search" className="text-blue-600 hover:underline">Go to Search</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/search" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back to Search
      </Link>
      <h1 className="text-2xl font-bold mb-6">Compare Cars</h1>
      <CompareTable listings={listings} />
    </div>
  );
};

export default ComparePage;