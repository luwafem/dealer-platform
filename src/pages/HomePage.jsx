import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { listingService } from '../services/listingService';
import ListingGrid from '../components/listings/ListingGrid';
import SearchBar from '../components/search/SearchBar';
import { Car, Users, Shield, Zap, PlusCircle, AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [distressListings, setDistressListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distressLoading, setDistressLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load both regular and distress listings in parallel
        const [regular, distress] = await Promise.all([
          listingService.getListings({ limit: 8 }),
          listingService.getListings({ is_distress: true, limit: 4 })
        ]);
        setFeaturedListings(regular);
        setDistressListings(distress);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
        setDistressLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nigeria's Premier Dealer Marketplace
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Buy and sell cars dealer-to-dealer with trust and transparency
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
          <div className="flex justify-center space-x-4">
            {user ? (
              <Link to="/add-listing" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
                <PlusCircle className="inline mr-2" size={20} />
                Sell Your Car
              </Link>
            ) : (
              <Link to="/register" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
                <PlusCircle className="inline mr-2" size={20} />
                Get Started – List Your Car
              </Link>
            )}
            <Link
              to="/search"
              className="inline-flex items-center border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600"
            >
              Browse All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AutoDealer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Dealers</h3>
              <p className="text-gray-600">All dealers are verified with transaction history and ratings.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant WhatsApp Contact</h3>
              <p className="text-gray-600">Connect directly with sellers via WhatsApp with our credit system.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dealer DNA</h3>
              <p className="text-gray-600">We learn your preferences and match you with the right cars.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Distress Sales Section */}
      {(!distressLoading && distressListings.length > 0) && (
        <section className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">🚨 Distress Sales</h2>
              </div>
              <Link
                to="/distress"
                className="text-red-600 hover:text-red-700 font-medium flex items-center"
              >
                View All
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <p className="text-gray-600 mb-6">
              Urgent sales – sellers are motivated to sell quickly. Don't miss these deals!
            </p>
            <ListingGrid listings={distressListings} loading={distressLoading} />
          </div>
        </section>
      )}

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Listings</h2>
          <ListingGrid listings={featuredListings} loading={loading} />
          <div className="text-center mt-8">
            <Link to="/search" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Browse All Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;