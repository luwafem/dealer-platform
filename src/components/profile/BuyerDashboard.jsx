import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDNA } from '../../hooks/useDNA';
import { listingService } from '../../services/listingService';
import { searchService } from '../../services/searchService';
import { whatsappService } from '../../services/whatsappService';
import { ratingService } from '../../services/ratingService';
import { 
  Heart, 
  Search, 
  MessageCircle, 
  Eye,
  Clock,
  Bell,
  Car,
  Brain,
  TrendingUp,
  AlertTriangle,
  Star
} from 'lucide-react';
import { timeAgo, formatNaira } from '../../utils/formatters'; 

const BuyerDashboard = () => {
  const { user, dealer } = useAuth();
  const navigate = useNavigate();
  const { dna, insights, loading: dnaLoading } = useDNA();
  const [watchlist, setWatchlist] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && dealer) {
      loadBuyerData();
      loadRatingInfo();
    }
  }, [user, dealer]);

  const loadBuyerData = async () => {
    setLoading(true);
    try {
      const [watchlistData, searchesData, contactsData] = await Promise.all([
        listingService.getWatchedListings(),
        searchService.getSavedSearches(),
        whatsappService.getContactHistory(dealer.id),
      ]);
      setWatchlist(watchlistData);
      setSavedSearches(searchesData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading buyer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatingInfo = async () => {
    try {
      setAvgRating(dealer.rating || 0);
      const trust = await ratingService.computeTrustScore(dealer.id);
      setTrustScore(trust);
    } catch (error) {
      console.error('Error loading rating info:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Buyer Dashboard</h1>

      {/* DNA Insights Card */}
      {!dnaLoading && (dna || insights?.length > 0) && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold">Your Dealer DNA</h2>
          </div>

          {insights && insights.length > 0 && (
            <div className="space-y-3 mb-4">
              {insights.map((insight, idx) => {
                let Icon = TrendingUp;
                let bgColor = 'bg-blue-50';
                let textColor = 'text-blue-800';
                if (insight.type === 'warning') {
                  Icon = AlertTriangle;
                  bgColor = 'bg-yellow-50';
                  textColor = 'text-yellow-800';
                }
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${bgColor} cursor-pointer hover:shadow-md transition`}
                    onClick={() => insight.action && navigate(insight.action)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className={`text-sm font-medium ${textColor}`}>{insight.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {dna && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {dna.preferred_makes?.length > 0 && (
                <div>
                  <p className="text-gray-500">Preferred Makes</p>
                  <p className="font-medium">{dna.preferred_makes.slice(0, 3).join(', ')}</p>
                </div>
              )}
              {dna.preferred_price_range?.min && (
                <div>
                  <p className="text-gray-500">Price Range</p>
                  <p className="font-medium">
                    ₦{dna.preferred_price_range.min?.toLocaleString()} – ₦{dna.preferred_price_range.max?.toLocaleString()}
                  </p>
                </div>
              )}
              {dna.deal_breakers?.length > 0 && (
                <div>
                  <p className="text-gray-500">Deal Breakers</p>
                  <p className="font-medium text-red-600">{dna.deal_breakers.slice(0, 2).join(', ')}</p>
                </div>
              )}
              {dna.must_haves?.length > 0 && (
                <div>
                  <p className="text-gray-500">Must-Haves</p>
                  <p className="font-medium text-green-600">{dna.must_haves.slice(0, 2).join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Watchlist</p>
              <p className="text-2xl font-bold">{watchlist.length}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Saved Searches</p>
              <p className="text-2xl font-bold">{savedSearches.length}</p>
            </div>
            <Search className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inquiries Made</p>
              <p className="text-2xl font-bold">{contacts.length}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rating & Trust</p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-bold mr-2">{avgRating.toFixed(1)}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {trustScore}% Trust
                </span>
              </div>
            </div>
            <Link
              to="/rate-transactions"
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Rate
            </Link>
          </div>
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Watchlist</h2>
          {watchlist.length > 0 && (
            <Link to="/watchlist" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          )}
        </div>
        {watchlist.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven't saved any cars yet. Browse listings and click the heart icon to add.
          </div>
        ) : (
          <div className="divide-y">
            {watchlist.slice(0, 5).map(listing => (
              <div key={listing.id} className="p-4 flex items-center hover:bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex-shrink-0">
                  {listing.photos?.[0] ? (
                    <img src={listing.photos[0]} alt="" className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Car size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {listing.make} {listing.model} {listing.year}
                  </h3>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-blue-600">{formatNaira(listing.price)}</p>
                  <p className="text-xs text-gray-500">Saved {timeAgo(listing.saved_at)}</p>
                </div>
                <Link
                  to={`/listings/${listing.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Searches */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Saved Searches</h2>
          {savedSearches.length > 0 && (
            <Link to="/saved-searches" className="text-sm text-blue-600 hover:underline">
              Manage
            </Link>
          )}
        </div>
        {savedSearches.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No saved searches. Use the search filters and click "Save Search".
          </div>
        ) : (
          <div className="divide-y">
            {savedSearches.slice(0, 5).map(search => (
              <div key={search.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium">{search.name}</p>
                  <p className="text-xs text-gray-500">
                    {search.search_criteria?.filters?.make || 'Any make'} • 
                    Last match: {search.last_match_at ? timeAgo(search.last_match_at) : 'Never'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {search.alerts_enabled && <Bell size={16} className="text-blue-500" />}
                  <Link
                    to={`/search?${new URLSearchParams(search.search_criteria.filters).toString()}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Run
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent WhatsApp Contacts</h2>
        </div>
        {contacts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven't contacted any sellers yet.
          </div>
        ) : (
          <div className="divide-y">
            {contacts.slice(0, 5).map(contact => {
              const isBuyer = contact.buyer_id === dealer.id;
              if (!isBuyer) return null;
              return (
                <div key={contact.id} className="p-4 flex items-center hover:bg-gray-50">
                  <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm">
                      You contacted{' '}
                      <span className="font-medium">
                        {contact.listing?.make} {contact.listing?.model}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo(contact.created_at)}</p>
                  </div>
                  <Link
                    to={`/listings/${contact.listing_id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;