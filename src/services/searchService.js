import { supabase } from '../lib/supabase';

export const searchService = {
  // Search listings with filters (public, no dealer join)
  async searchListings({ query, ...filters }) {
    let dbQuery = supabase
      .from('listings')
      .select('*')   // no dealer join – avoids RLS issues
      .eq('status', 'available');

    // Text search (simple ILIKE)
    if (query) {
      dbQuery = dbQuery.or(`make.ilike.%${query}%,model.ilike.%${query}%`);
    }

    // Apply filters
    if (filters.make) dbQuery = dbQuery.eq('make', filters.make);
    if (filters.model) dbQuery = dbQuery.ilike('model', `%${filters.model}%`);
    if (filters.minYear) dbQuery = dbQuery.gte('year', parseInt(filters.minYear));
    if (filters.maxYear) dbQuery = dbQuery.lte('year', parseInt(filters.maxYear));
    if (filters.minPrice) dbQuery = dbQuery.gte('price', parseInt(filters.minPrice));
    if (filters.maxPrice) dbQuery = dbQuery.lte('price', parseInt(filters.maxPrice));
    if (filters.location) dbQuery = dbQuery.eq('location', filters.location);
    if (filters.category) dbQuery = dbQuery.eq('category', filters.category);
    if (filters.engineType) dbQuery = dbQuery.eq('engine_type', filters.engineType);
    if (filters.transmission) dbQuery = dbQuery.eq('transmission', filters.transmission);
    if (filters.mileageMax) dbQuery = dbQuery.lte('mileage', parseInt(filters.mileageMax));
    if (filters.accidentHistory) dbQuery = dbQuery.eq('accident_history', filters.accidentHistory);
    if (filters.customsStatus) dbQuery = dbQuery.eq('customs_status', filters.customsStatus);

    // Deal breakers (exclude) – simplified
    if (filters.dealBreakers && filters.dealBreakers.length > 0) {
      if (filters.dealBreakers.includes('rebuilt_engine')) {
        dbQuery = dbQuery.neq('engine_condition', 'Rebuilt');
      }
      // Add more exclusions as needed
    }

    // Must-haves (require)
    if (filters.mustHaves && filters.mustHaves.length > 0) {
      filters.mustHaves.forEach(have => {
        switch (have) {
          case 'sunroof':
            dbQuery = dbQuery.eq('sunroof', true);
            break;
          case 'leather':
            dbQuery = dbQuery.eq('leather', true);
            break;
          case 'navigation':
            dbQuery = dbQuery.eq('navigation', true);
            break;
          case 'original_paint':
            dbQuery = dbQuery.eq('paint', 'Original');
            break;
          case 'service_history':
            dbQuery = dbQuery.neq('service_history', 'None');
            break;
          default:
            break;
        }
      });
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Save a search for the current user
  async saveSearch({ name, criteria }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('saved_searches')
      .insert([{
        dealer_id: user.id,
        name,
        search_criteria: criteria,
        alerts_enabled: true,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get saved searches for current user
  async getSavedSearches() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update saved search (e.g., toggle alerts)
  async updateSavedSearch(id, updates) {
    const { data, error } = await supabase
      .from('saved_searches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete saved search
  async deleteSavedSearch(id) {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Record search history (for DNA learning)
  async recordSearchHistory(filters, resultsCount) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('search_history')
      .insert([{
        dealer_id: user.id,
        filters,
        results_count: resultsCount,
      }]);

    if (error) console.error('Error recording search history:', error);
  },
};