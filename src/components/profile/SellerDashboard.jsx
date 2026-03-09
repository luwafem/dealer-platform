import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { listingService } from '../../services/listingService';
import { soldService } from '../../services/soldService';
import { whatsappService } from '../../services/whatsappService';
import { ratingService } from '../../services/ratingService';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Car, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Gauge
} from 'lucide-react';
import { formatNaira, timeAgo } from '../../utils/formatters';
import { PLAN_DETAILS } from '../../utils/constants';

const SellerDashboard = () => {
  const { user, dealer } = useAuth();
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState([]);
  const [soldListings, setSoldListings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [trustScore, setTrustScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && dealer) {
      loadSellerData();
    }
  }, [user, dealer]);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      const [active, sold, contactsData] = await Promise.all([
        listingService.getListingsByDealer(dealer.id, 'available'),
        listingService.getListingsByDealer(dealer.id, 'sold'),
        whatsappService.getContactHistory(dealer.id),
      ]);
      setActiveListings(active);
      setSoldListings(sold);
      setContacts(contactsData);

      // Compute trust score
      const score = await ratingService.computeTrustScore(dealer.id);
      setTrustScore(score);
    } catch (error) {
      console.error('Error loading seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Count contacts where dealer is the seller (someone contacted them)
  const contactsAsSeller = contacts.filter(c => c.seller_id === dealer.id).length;
  // Count contacts where dealer is the buyer (they initiated)
  const contactsAsBuyer = contacts.filter(c => c.buyer_id === dealer.id).length;

  // Get plan details and max listings
  const plan = PLAN_DETAILS[dealer?.subscription_plan || 'basic'];
  const maxListings = plan?.maxListings || 2;
  const listingsUsed = activeListings.length;
  const remaining = maxListings === Infinity ? '∞' : maxListings - listingsUsed;
  const isUnlimited = maxListings === Infinity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <div className="flex space-x-3">
          <Link
            to="/rate-transactions"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            <Star size={20} className="mr-2" />
            Rate Transactions
          </Link>
          <button
            onClick={() => navigate('/add-listing')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add New Listing
          </button>
        </div>
      </div>

      {/* Trust Score Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Your Trust Score</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                <span className="text-sm text-gray-600">{dealer.rating || 0} average</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                <span className="text-sm text-gray-600">{dealer.paid_deals || 0} completed deals</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-blue-600">{trustScore || 0}%</span>
            <p className="text-xs text-gray-500">Trust Score</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${trustScore || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold">{listingsUsed}</p>
            </div>
            <Car className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sold Cars</p>
              <p className="text-2xl font-bold">{soldListings.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inquiries Received</p>
              <p className="text-2xl font-bold">{contactsAsSeller}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">
                {activeListings.reduce((sum, l) => sum + (l.views || 0), 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Listings Used</p>
              <p className="text-2xl font-bold">
                {listingsUsed} / {isUnlimited ? '∞' : maxListings}
              </p>
              {!isUnlimited && remaining >= 0 && (
                <p className="text-xs text-gray-500">{remaining} remaining</p>
              )}
            </div>
            <Gauge className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Active Listings</h2>
          {activeListings.length > 0 && (
            <Link to="/listings?status=active" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          )}
        </div>
        {activeListings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You have no active listings. Click "Add New Listing" to get started.
          </div>
        ) : (
          <div className="divide-y">
            {activeListings.slice(0, 5).map(listing => (
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
                  <p className="text-sm text-gray-500">{listing.location} • {listing.views} views</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-blue-600">{formatNaira(listing.price)}</p>
                  <p className="text-xs text-gray-500">Posted {timeAgo(listing.created_at)}</p>
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

      {/* Sold Listings */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recently Sold</h2>
        </div>
        {soldListings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No sold cars yet.
          </div>
        ) : (
          <div className="divide-y">
            {soldListings.slice(0, 5).map(listing => (
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
                  <p className="text-sm text-gray-500">Sold {timeAgo(listing.sold_date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatNaira(listing.sold_price)}</p>
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
            No contacts yet.
          </div>
        ) : (
          <div className="divide-y">
            {contacts.slice(0, 5).map(contact => {
              const isBuyer = contact.buyer_id === dealer.id;
              return (
                <div key={contact.id} className="p-4 flex items-center hover:bg-gray-50">
                  <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm">
                      {isBuyer ? 'You contacted' : 'Someone contacted you about'}{' '}
                      <span className="font-medium">
                        {contact.listing?.make} {contact.listing?.model}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo(contact.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;