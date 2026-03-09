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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Not enough cars</h2>
            <p className="font-bold mb-6">Please select at least 2 cars to compare.</p>
            <Link
              to="/search"
              className="inline-block border-2 border-black bg-yellow-400 text-black px-6 py-3 font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Go to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/search"
          className="inline-flex items-center border-2 border-black bg-white text-black px-4 py-2 font-black uppercase text-sm hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6"
        >
          <ArrowLeft size={16} className="mr-2" strokeWidth={2} />
          Back to Search
        </Link>
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Compare <br /> Cars
          </h1>
        </div>
        <CompareTable listings={listings} />
      </div>
    </div>
  );
};

export default ComparePage;