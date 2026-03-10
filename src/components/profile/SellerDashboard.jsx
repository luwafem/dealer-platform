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
  CheckCircle,
  MessageCircle,
  Eye,
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
    window.scrollTo(0, 0);
  }, []);

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
      <div className="min-h-screen bg-[#f4f4f2] flex justify-center items-center">
        <div className="border-2 border-black p-8 bg-white">
          <div className="animate-spin rounded-none h-12 w-12 border-2 border-black border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const contactsAsSeller = contacts.filter(c => c.seller_id === dealer.id).length;
  const contactsAsBuyer = contacts.filter(c => c.buyer_id === dealer.id).length;

  const plan = PLAN_DETAILS[dealer?.subscription_plan || 'basic'];
  const maxListings = plan?.maxListings || 2;
  const listingsUsed = activeListings.length;
  const remaining = maxListings === Infinity ? '∞' : maxListings - listingsUsed;
  const isUnlimited = maxListings === Infinity;

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Seller <br /> Dashboard
            </h1>
            <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
              Manage your inventory and track performance
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/rate-transactions"
              className="border-2 border-black bg-black text-white px-6 py-3 font-black uppercase hover:bg-yellow-400 hover:text-black hover:border-black transition-colors flex items-center"
            >
              <Star size={20} className="mr-2" />
              Rate Transactions
            </Link>
            <button
              onClick={() => navigate('/add-listing')}
              className="border-2 border-black bg-yellow-400 text-black px-6 py-3 font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Listing
            </button>
          </div>
        </div>

        {/* Trust Score Card */}
        <div className="bg-[#f4f4f2] border-2 border-black p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Trust Score</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-black mr-1" strokeWidth={2} />
                  <span className="font-bold uppercase text-sm">{dealer.rating || 0} avg</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-black mr-1" strokeWidth={2} />
                  <span className="font-bold uppercase text-sm">{dealer.paid_deals || 0} completed</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black">{trustScore || 0}%</span>
              <p className="text-xs font-bold uppercase">Score</p>
            </div>
          </div>
          <div className="w-full bg-gray-300 h-4 mt-3 border-2 border-black">
            <div
              className="bg-black h-full"
              style={{ width: `${trustScore || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#f4f4f2] border-2 border-black p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Active</p>
              <p className="text-3xl font-black">{listingsUsed}</p>
            </div>
            <Car size={32} strokeWidth={2} />
          </div>
          <div className="bg-[#f4f4f2] border-2 border-black p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Sold</p>
              <p className="text-3xl font-black">{soldListings.length}</p>
            </div>
            <CheckCircle size={32} strokeWidth={2} />
          </div>
          <div className="bg-[#f4f4f2] border-2 border-black p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Inquiries</p>
              <p className="text-3xl font-black">{contactsAsSeller}</p>
            </div>
            <MessageCircle size={32} strokeWidth={2} />
          </div>
          <div className="bg-[#f4f4f2] border-2 border-black p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Views</p>
              <p className="text-3xl font-black">
                {activeListings.reduce((sum, l) => sum + (l.views || 0), 0)}
              </p>
            </div>
            <Eye size={32} strokeWidth={2} />
          </div>
          <div className="bg-[#f4f4f2] border-2 border-black p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold uppercase">Listings</p>
              <p className="text-3xl font-black">
                {listingsUsed} / {isUnlimited ? '∞' : maxListings}
              </p>
              {!isUnlimited && remaining >= 0 && (
                <p className="text-xs font-bold">{remaining} left</p>
              )}
            </div>
            <Gauge size={32} strokeWidth={2} />
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-[#f4f4f2] border-2 border-black mt-8">
          <div className="border-b-2 border-black px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Active Listings</h2>
            {activeListings.length > 0 && (
              <Link to="/listings?status=active" className="font-bold uppercase underline hover:no-underline">
                View All
              </Link>
            )}
          </div>
          {activeListings.length === 0 ? (
            <div className="p-6 text-center font-bold">
              No active listings. Click "Add Listing" to get started.
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {activeListings.slice(0, 5).map(listing => (
                <div key={listing.id} className="p-4 flex items-center hover:bg-yellow-100 transition-colors">
                  <div className="w-16 h-16 bg-gray-200 border-2 border-black mr-4 flex-shrink-0">
                    {listing.photos?.[0] ? (
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black uppercase">
                      {listing.make} {listing.model} {listing.year}
                    </h3>
                    <p className="text-sm font-bold">{listing.location} • {listing.views} views</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-black">{formatNaira(listing.price)}</p>
                    <p className="text-xs font-bold">Posted {timeAgo(listing.created_at)}</p>
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

        {/* Sold Listings */}
        <div className="bg-[#f4f4f2] border-2 border-black mt-8">
          <div className="border-b-2 border-black px-6 py-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Recently Sold</h2>
          </div>
          {soldListings.length === 0 ? (
            <div className="p-6 text-center font-bold">
              No sold cars yet.
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {soldListings.slice(0, 5).map(listing => (
                <div key={listing.id} className="p-4 flex items-center hover:bg-yellow-100 transition-colors">
                  <div className="w-16 h-16 bg-gray-200 border-2 border-black mr-4 flex-shrink-0">
                    {listing.photos?.[0] ? (
                      <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black uppercase">
                      {listing.make} {listing.model} {listing.year}
                    </h3>
                    <p className="text-sm font-bold">Sold {timeAgo(listing.sold_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-600">{formatNaira(listing.sold_price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-[#f4f4f2] border-2 border-black mt-8">
          <div className="border-b-2 border-black px-6 py-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Recent WhatsApp Contacts</h2>
          </div>
          {contacts.length === 0 ? (
            <div className="p-6 text-center font-bold">
              No contacts yet.
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {contacts.slice(0, 5).map(contact => {
                const isBuyer = contact.buyer_id === dealer.id;
                return (
                  <div key={contact.id} className="p-4 flex items-center hover:bg-yellow-100 transition-colors">
                    <MessageCircle size={20} className="mr-3" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="font-bold">
                        {isBuyer ? 'You contacted' : 'Someone contacted you about'}{' '}
                        <span className="uppercase">
                          {contact.listing?.make} {contact.listing?.model}
                        </span>
                      </p>
                      <p className="text-xs font-bold">{timeAgo(contact.created_at)}</p>
                    </div>
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

export default SellerDashboard;