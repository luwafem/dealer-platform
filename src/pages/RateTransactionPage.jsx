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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Rate Your Transactions</h1>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No pending transactions to rate.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map(t => (
            <div key={t.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="font-medium">
                    {t.listing?.make} {t.listing?.model} {t.listing?.year}
                  </p>
                  <p className="text-sm text-gray-500">Sold for {formatNaira(t.sale_price)}</p>
                  <p className="text-xs text-gray-400">
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
                        size={24}
                        className={`${
                          star <= (ratings[t.id]?.rating || 0)
                            ? 'text-yellow-400 fill-current'
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
                className="mt-3 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                rows="2"
              />
              <button
                onClick={() => handleSubmit(t)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Send size={16} className="mr-2" />
                Submit Rating
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RateTransactionPage;