import { supabase } from '../lib/supabase';

export const ratingService = {
  // Create a new rating
  async createRating({ transactionId, fromDealerId, toDealerId, rating, review }) {
    const { data, error } = await supabase
      .from('ratings')
      .insert([{
        transaction_id: transactionId,
        from_dealer: fromDealerId,
        to_dealer: toDealerId,
        rating,
        review,
      }])
      .select()
      .single();

    if (error) throw error;

    // Update the recipient dealer's average rating and deals_count? Actually deals_count is already updated via sold payments.
    // We'll recalc average rating.
    await this.updateDealerRating(toDealerId);

    return data;
  },

  // Get ratings given to a dealer
  async getRatingsForDealer(dealerId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('*, from_dealer:dealers!from_dealer(business_name)')
      .eq('to_dealer', dealerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get ratings given by a dealer
  async getRatingsGivenBy(dealerId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('from_dealer', dealerId);

    if (error) throw error;
    return data;
  },

  // Recalculate average rating for a dealer
  async updateDealerRating(dealerId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('to_dealer', dealerId);

    if (error) throw error;

    if (data.length === 0) return;

    const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
    const roundedAvg = Math.round(avg * 10) / 10; // one decimal

    await supabase
      .from('dealers')
      .update({ rating: roundedAvg })
      .eq('id', dealerId);
  },

  // Compute trust score for a dealer
  async computeTrustScore(dealerId) {
    const { data: dealer, error } = await supabase
      .from('dealers')
      .select('rating, paid_deals, verified')
      .eq('id', dealerId)
      .single();

    if (error) throw error;

    let score = 0;
    // Rating: 0-40 points (max at rating 5)
    score += (dealer.rating || 0) * 8; // 5*8 = 40

    // Transactions: up to 30 points (capped at 30 transactions)
    const transactionPoints = Math.min(dealer.paid_deals || 0, 30);
    score += transactionPoints;

    // Verified badge gives 10 points
    if (dealer.verified) score += 10;

    // Payment reliability: default 20 points (we can adjust later)
    score += 20;

    // Cap at 100
    return Math.min(score, 100);
  },
};