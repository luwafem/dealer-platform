import { supabase } from '../lib/supabase';

export const paymentService = {
  // Get all payments for the current user (subscriptions + sold fees)
  async getUserPayments() {
    const user = await supabase.auth.getUser();
    if (!user) return [];

    // Get subscriptions
    const { data: subs, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false });

    if (subError) throw subError;

    // Get sold payments (fees)
    const { data: sold, error: soldError } = await supabase
      .from('sold_payments')
      .select('*')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false });

    if (soldError) throw soldError;

    // Combine and format
    const combined = [
      ...subs.map(s => ({
        ...s,
        type: 'subscription',
        description: `Subscription - ${s.plan}`,
        amount: s.amount,
        reference: s.payment_reference,
        status: 'completed',
        created_at: s.created_at,
      })),
      ...sold.map(s => ({
        ...s,
        type: 'sold_fee',
        description: `Sold fee for listing`,
        amount: s.amount,
        reference: s.reference,
        status: s.status,
        created_at: s.created_at,
      })),
    ];

    // Sort by date descending
    return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Save a sold payment record
  async recordSoldPayment(listingId, salePrice, fee, reference) {
    const user = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sold_payments')
      .insert([{
        listing_id: listingId,
        dealer_id: user.id,
        sale_price: salePrice,
        amount: fee,
        reference,
        status: 'completed',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};