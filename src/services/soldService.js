import { supabase } from '../lib/supabase';

export const soldService = {
  // Mark a listing as sold (no fee)
  async markAsSold(listingId, buyerId = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update listing status to 'sold'
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        status: 'sold',
        sold_date: new Date().toISOString(),
        sold_to: buyerId,
      })
      .eq('id', listingId)
      .eq('dealer_id', user.id); // ensure ownership

    if (updateError) throw updateError;

    // Optionally record in sold_payments (without amount)
    if (buyerId) {
      await supabase
        .from('sold_payments')
        .insert([{
          listing_id: listingId,
          dealer_id: user.id,
          buyer_id: buyerId,
          sale_price: 0, // or keep actual sale price if you still capture it
          amount: 0,
          reference: 'sold_free',
        }]);
    }

    // Trigger badge check for seller
    await supabase.rpc('check_verified_badge', { dealer_id: user.id });

    return true;
  },

  // Get sold history for a dealer (as seller)
  async getSoldHistory(dealerId) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('dealer_id', dealerId)
      .eq('status', 'sold')
      .order('sold_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get bought history for a dealer (as buyer)
  async getBoughtHistory(dealerId) {
    const { data, error } = await supabase
      .from('sold_payments')
      .select(`
        *,
        listing:listings(make, model, year, photos)
      `)
      .eq('buyer_id', dealerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};