import { supabase } from '../lib/supabase';

/**
 * Listing Service
 * 
 * Requires the following RPC function in Supabase:
 * 
 * CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
 * RETURNS void AS $$
 * BEGIN
 *   UPDATE listings SET views = views + 1 WHERE id = listing_id;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * CREATE OR REPLACE FUNCTION can_create_listing(dealer_id UUID)
 * RETURNS BOOLEAN AS $$
 * DECLARE
 *   current_plan TEXT;
 *   active_count INTEGER;
 *   max_allowed INTEGER;
 * BEGIN
 *   SELECT subscription_plan INTO current_plan FROM dealers WHERE id = dealer_id;
 *   SELECT COUNT(*) INTO active_count FROM listings 
 *   WHERE dealer_id = dealer_id AND status = 'available';
 *   IF current_plan = 'enterprise' THEN
 *     max_allowed := 999999;
 *   ELSIF current_plan = 'pro' THEN
 *     max_allowed := 15;
 *   ELSE
 *     max_allowed := 2;
 *   END IF;
 *   RETURN active_count < max_allowed;
 * END;
 * $$ LANGUAGE plpgsql;
 */

export const listingService = {
  // Create a new listing
  async createListing(listingData) {
    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing listing
  async updateListing(id, updates) {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get a single listing by ID (no join, fetch dealer separately)
  async getListingById(id) {
    // First get the listing
    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Then fetch dealer info (if accessible)
    try {
      const { data: dealer } = await supabase
        .from('dealers')
        .select('id, business_name, phone, rating, verified')
        .eq('id', listing.dealer_id)
        .single();
      listing.dealer = dealer;
    } catch (dealerError) {
      console.log('Dealer info not available:', dealerError.message);
      listing.dealer = null; // dealer section will be skipped
    }

    return listing;
  },

  // Get listings with optional filters (public, no dealer join)
  async getListings(filters = {}) {
    let query = supabase
      .from('listings')
      .select('*')  // no dealer join – avoids RLS issues on dealers
      .eq('status', filters.status || 'available')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.make) query = query.eq('make', filters.make);
    if (filters.model) query = query.ilike('model', `%${filters.model}%`);
    if (filters.minYear) query = query.gte('year', filters.minYear);
    if (filters.maxYear) query = query.lte('year', filters.maxYear);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.location) query = query.eq('location', filters.location);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get listings that the user has saved (watched)
  async getWatchedListings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_listings')
      .select('listing_id, listings(*)')
      .eq('dealer_id', user.id);

    if (error) throw error;
    return data.map(item => item.listings);
  },

  // Get listings by dealer
  async getListingsByDealer(dealerId, status = null) {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('dealer_id', dealerId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Count active listings for a dealer
  async countActiveListings(dealerId) {
    const { count, error } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', dealerId)
      .eq('status', 'available');

    if (error) throw error;
    return count;
  },

  // Check if dealer can create a new listing based on plan limits
  async canCreateListing(dealerId) {
    const { data, error } = await supabase.rpc('can_create_listing', {
      dealer_id: dealerId,
    });
    if (error) throw error;
    return data; // boolean
  },

  // Delete a listing
  async deleteListing(id) {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Increment view count
  async incrementViews(id) {
    const { error } = await supabase.rpc('increment_listing_views', { listing_id: id });
    if (error) {
      console.error('Error incrementing views:', error);
      // Optionally rethrow if you want calling code to handle it
      // throw error;
    }
  },
};