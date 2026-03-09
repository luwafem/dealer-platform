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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <div className="min-h-screen bg-[#f4f4f2] flex justify-center items-center">
        <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="animate-spin rounded-none h-12 w-12 border-2 border-black border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Buyer <br /> Dashboard
            </h1>
            <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
              Track your watchlist, searches, and inquiries
            </p>
          </div>
          <Link
            to="/rate-transactions"
            className="border-2 border-black bg-black text-white px-6 py-3 font-black uppercase hover:bg-yellow-400 hover:text-black hover:border-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center"
          >
            <Star size={20} className="mr-2" strokeWidth={2} />
            Rate Transactions
          </Link>
        </div>

        {/* DNA Insights Card */}
        {!dnaLoading && (dna || insights?.length > 0) && (
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={24} strokeWidth={2} />
              <h2 className="text-2xl font-black uppercase tracking-tighter">Your Dealer DNA</h2>
            </div>

            {insights && insights.length > 0 && (
              <div className="space-y-3 mb-4">
                {insights.map((insight, idx) => {
                  let Icon = TrendingUp;
                  let bgColor = 'bg-yellow-100';
                  let textColor = 'text-black';
                  if (insight.type === 'warning') {
                    Icon = AlertTriangle;
                    bgColor = 'bg-red-100';
                    textColor = 'text-red-800';
                  }
                  return (
                    <div
                      key={idx}
                      className={`p-3 border-2 border-black bg-white cursor-pointer hover:bg-yellow-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                      onClick={() => insight.action && navigate(insight.action)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={20} strokeWidth={2} className={`flex-shrink-0 mt-0.5`} />
                        <div>
                          <p className={`font-black uppercase text-sm`}>{insight.title}</p>
                          <p className="text-xs font-bold mt-1">{insight.description}</p>
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
                    <p className="text-xs font-bold uppercase">Preferred Makes</p>
                    <p className="font-black">{dna.preferred_makes.slice(0, 3).join(', ')}</p>
                  </div>
                )}
                {dna.preferred_price_range?.min && (
                  <div>
                    <p className="text-xs font-bold uppercase">Price Range</p>
                    <p className="font-black">
                      ₦{dna.preferred_price_range.min?.toLocaleString()} – ₦{dna.preferred_price_range.max?.toLocaleString()}
                    </p>
                  </div>
                )}
                {dna.deal_breakers?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase">Deal Breakers</p>
                    <p className="font-black text-red-600">{dna.deal_breakers.slice(0, 2).join(', ')}</p>
                  </div>
                )}
                {dna.must_haves?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase">Must-Haves</p>
                    <p className="font-black text-green-600">{dna.must_haves.slice(0, 2).join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Watchlist</p>
              <p className="text-3xl font-black">{watchlist.length}</p>
            </div>
            <Heart size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Saved Searches</p>
              <p className="text-3xl font-black">{savedSearches.length}</p>
            </div>
            <Search size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Inquiries Made</p>
              <p className="text-3xl font-black">{contacts.length}</p>
            </div>
            <MessageCircle size={32} strokeWidth={2} />
          </div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold uppercase">Rating & Trust</p>
              <Link
                to="/rate-transactions"
                className="border-2 border-black bg-black text-white px-2 py-1 text-xs font-bold uppercase hover:bg-yellow-400 hover:text-black transition-colors"
              >
                Rate
              </Link>
            </div>
            <div className="flex items-center mt-2">
              <Star size={16} className="text-black mr-1" strokeWidth={2} fill="currentColor" />
              <span className="font-black mr-2">{avgRating.toFixed(1)}</span>
              <span className="text-xs font-bold border-2 border-black px-2 py-0.5 bg-white">
                {trustScore}% Trust
              </span>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-8">
          <div className="border-b-2 border-black px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Your Watchlist</h2>
            {watchlist.length > 0 && (
              <Link to="/watchlist" className="font-bold uppercase underline hover:no-underline">
                View All
              </Link>
            )}
          </div>
          {watchlist.length === 0 ? (
            <div className="p-6 text-center font-bold">
              You haven't saved any cars yet. Browse listings and click the heart icon to add.
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {watchlist.slice(0, 5).map(listing => (
                <div key={listing.id} className="p-4 flex items-center hover:bg-yellow-100 transition-colors">
                  <div className="w-16 h-16 bg-gray-200 border-2 border-black mr-4 flex-shrink-0">
                    {listing.photos?.[0] ? (
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car size={24} strokeWidth={2} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black uppercase">
                      {listing.make} {listing.model} {listing.year}
                    </h3>
                    <p className="text-sm font-bold">{listing.location}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-black">{formatNaira(listing.price)}</p>
                    <p className="text-xs font-bold">Saved {timeAgo(listing.saved_at)}</p>
                  </div>
                  <Link
                    to={`/listings/${listing.id}`}
                    className="border-2 border-black px-4 py-2 font-bold uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Searches */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-8">
          <div className="border-b-2 border-black px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Saved Searches</h2>
            {savedSearches.length > 0 && (
              <Link to="/saved-searches" className="font-bold uppercase underline hover:no-underline">
                Manage
              </Link>
            )}
          </div>
          {savedSearches.length === 0 ? (
            <div className="p-6 text-center font-bold">
              No saved searches. Use the search filters and click "Save Search".
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {savedSearches.slice(0, 5).map(search => (
                <div key={search.id} className="p-4 flex items-center justify-between hover:bg-yellow-100 transition-colors">
                  <div>
                    <p className="font-black uppercase">{search.name}</p>
                    <p className="text-xs font-bold">
                      {search.search_criteria?.filters?.make || 'Any make'} • 
                      Last match: {search.last_match_at ? timeAgo(search.last_match_at) : 'Never'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {search.alerts_enabled && <Bell size={16} strokeWidth={2} className="text-black" />}
                    <Link
                      to={`/search?${new URLSearchParams(search.search_criteria.filters).toString()}`}
                      className="border-2 border-black px-3 py-1 font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
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
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-8">
          <div className="border-b-2 border-black px-6 py-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Recent WhatsApp Contacts</h2>
          </div>
          {contacts.length === 0 ? (
            <div className="p-6 text-center font-bold">
              You haven't contacted any sellers yet.
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {contacts.slice(0, 5).map(contact => {
                const isBuyer = contact.buyer_id === dealer.id;
                if (!isBuyer) return null;
                return (
                  <div key={contact.id} className="p-4 flex items-center hover:bg-yellow-100 transition-colors">
                    <MessageCircle size={20} className="mr-3" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="font-bold">
                        You contacted{' '}
                        <span className="uppercase">
                          {contact.listing?.make} {contact.listing?.model}
                        </span>
                      </p>
                      <p className="text-xs font-bold">{timeAgo(contact.created_at)}</p>
                    </div>
                    <Link
                      to={`/listings/${contact.listing_id}`}
                      className="border-2 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
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
    </div>
  );
};

export default BuyerDashboard;