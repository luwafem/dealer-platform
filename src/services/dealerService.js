import { supabase } from '../lib/supabase';

export const dealerService = {
  // Update dealer profile
  async updateDealer(dealerId, updates) {
    // Remove any undefined or null values to avoid issues
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v != null)
    );

    const { data, error } = await supabase
      .from('dealers')
      .update(cleanUpdates)
      .eq('id', dealerId)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      // This can happen if the dealer ID doesn't exist or RLS blocks the update
      throw new Error('No dealer found or you do not have permission to update');
    }

    return data[0];
  },

  // Get dealer by ID (if needed separately)
  async getDealer(dealerId) {
    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('id', dealerId)
      .maybeSingle(); // Use maybeSingle to avoid 406 when no row

    if (error) throw error;
    return data; // may be null
  },

  // Search dealers by name, phone, or email (for admin use)
  async searchDealers(query) {
    if (!query || query.trim() === '') return [];
    
    const { data, error } = await supabase
      .from('dealers')
      .select('id, business_name, phone, email, subscription_plan, subscription_expiry')
      .or(`business_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return data;
  },
};