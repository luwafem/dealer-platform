import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { soldService } from '../services/soldService';
import { ratingService } from '../services/ratingService';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatNaira } from '../utils/formatters';

const RateTransactionPage = () => {
  const { user, dealer } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({}); // transactionId -> { rating, review }

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      // Fetch both sold (as seller) and bought (as buyer) transactions
      const [sold, bought] = await Promise.all([
        soldService.getSoldHistory(dealer.id),
        soldService.getBoughtHistory(dealer.id)
      ]);

      // Combine both arrays
      const allTransactions = [...sold, ...bought];

      // Get ratings already given by this dealer
      const givenRatings = await ratingService.getRatingsGivenBy(dealer.id);
      const ratedTransactionIds = new Set(givenRatings.map(r => r.transaction_id));

      // Filter out transactions already rated
      const unrated = allTransactions.filter(t => !ratedTransactionIds.has(t.id));

      setTransactions(unrated);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (transactionId, rating) => {
    setRatings(prev => ({
      ...prev,
      [transactionId]: { ...prev[transactionId], rating }
    }));
  };

  const handleReviewChange = (transactionId, review) => {
    setRatings(prev => ({
      ...prev,
      [transactionId]: { ...prev[transactionId], review }
    }));
  };

  const handleSubmit = async (transaction) => {
    const ratingData = ratings[transaction.id];
    if (!ratingData || !ratingData.rating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      // Determine the other party (buyer or seller)
      const isSeller = transaction.dealer_id === dealer.id;
      const otherPartyId = isSeller ? transaction.buyer_id : transaction.dealer_id;

      await ratingService.createRating({
        transactionId: transaction.id,
        fromDealerId: dealer.id,
        toDealerId: otherPartyId,
        rating: ratingData.rating,
        review: ratingData.review || '',
      });

      toast.success('Rating submitted');
      // Remove from list
      setTransactions(prev => prev.filter(t => t.id !== transaction.id));
      setRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[transaction.id];
        return newRatings;
      });
    } catch (error) {
      toast.error(error.message);
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Rate Your <br /> Transactions
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Share your experience with other dealers
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <p className="font-bold text-lg">No pending transactions to rate.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map(t => (
              <div key={t.id} className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-black uppercase text-lg">
                      {t.listing?.make} {t.listing?.model} {t.listing?.year}
                    </p>
                    <p className="font-bold">Sold for {formatNaira(t.sale_price)}</p>
                    <p className="text-sm font-medium">
                      {t.dealer_id === dealer.id ? 'You sold this car' : 'You bought this car'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(t.id, star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={28}
                          strokeWidth={2}
                          className={`${
                            star <= (ratings[t.id]?.rating || 0)
                              ? 'text-black fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Write a review (optional)"
                  value={ratings[t.id]?.review || ''}
                  onChange={(e) => handleReviewChange(t.id, e.target.value)}
                  className="mt-3 w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  rows="2"
                />
                <button
                  onClick={() => handleSubmit(t)}
                  className="mt-2 border-2 border-black bg-yellow-400 text-black px-6 py-2 font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center"
                >
                  <Send size={16} className="mr-2" strokeWidth={2} />
                  Submit Rating
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RateTransactionPage;