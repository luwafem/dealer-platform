import { supabase } from '../lib/supabase';

export const dnaService = {
  // Get dealer DNA for current user
  async getDealerDNA() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('dealer_dna')
      .select('*')
      .eq('dealer_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Update dealer DNA (usually called after search)
  async updateDNA(preferences) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const existing = await this.getDealerDNA();

    const payload = {
      ...preferences,
      last_updated: new Date(),
      search_volume: existing?.search_volume ? existing.search_volume + 1 : 1,
    };

    if (existing) {
      const { error } = await supabase
        .from('dealer_dna')
        .update(payload)
        .eq('dealer_id', user.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('dealer_dna')
        .insert([{ dealer_id: user.id, ...payload }]);
      if (error) throw error;
    }

    return true;
  },

  // Record a search to learn preferences
  async recordSearch(searchFilters, resultsCount) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: historyError } = await supabase
      .from('search_history')
      .insert([{
        dealer_id: user.id,
        filters: searchFilters,
        results_count: resultsCount,
      }]);

    if (historyError) {
      console.error('Error recording search history:', historyError);
      return;
    }

    await this.learnFromSearch(searchFilters);
  },

  // Internal: aggregate search history to update DNA
  async learnFromSearch() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: searches, error } = await supabase
      .from('search_history')
      .select('filters')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching search history:', error);
      return;
    }

    if (searches.length === 0) return;

    // Aggregate preferences (same as before)
    const makes = {};
    const models = {};
    const years = { min: Infinity, max: -Infinity };
    const prices = { min: Infinity, max: -Infinity };
    const locations = {};
    const categories = {};
    const dealBreakers = {};
    const mustHaves = {};

    searches.forEach(s => {
      const f = s.filters;
      if (f.make) makes[f.make] = (makes[f.make] || 0) + 1;
      if (f.model) models[f.model] = (models[f.model] || 0) + 1;
      if (f.minYear && f.minYear < years.min) years.min = f.minYear;
      if (f.maxYear && f.maxYear > years.max) years.max = f.maxYear;
      if (f.minPrice && f.minPrice < prices.min) prices.min = f.minPrice;
      if (f.maxPrice && f.maxPrice > prices.max) prices.max = f.maxPrice;
      if (f.location) locations[f.location] = (locations[f.location] || 0) + 1;
      if (f.category) categories[f.category] = (categories[f.category] || 0) + 1;
      if (f.dealBreakers) {
        f.dealBreakers.forEach(db => { dealBreakers[db] = (dealBreakers[db] || 0) + 1; });
      }
      if (f.mustHaves) {
        f.mustHaves.forEach(mh => { mustHaves[mh] = (mustHaves[mh] || 0) + 1; });
      }
    });

    const topMakes = Object.entries(makes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([make]) => make);

    const topModels = Object.entries(models)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([model]) => model);

    const topLocations = Object.entries(locations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([loc]) => loc);

    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    const topDealBreakers = Object.entries(dealBreakers)
      .filter(([_, count]) => count > searches.length * 0.3)
      .map(([db]) => db);

    const topMustHaves = Object.entries(mustHaves)
      .filter(([_, count]) => count > searches.length * 0.3)
      .map(([mh]) => mh);

    const update = {
      preferred_makes: topMakes,
      preferred_models: topModels,
      preferred_years: years.min !== Infinity ? years : { min: null, max: null },
      preferred_price_range: prices.min !== Infinity ? prices : { min: null, max: null },
      preferred_locations: topLocations,
      preferred_categories: topCategories,
      deal_breakers: topDealBreakers,
      must_haves: topMustHaves,
    };

    await this.updateDNA(update);
  },

  // Generate insights based on DNA and market
  async getInsights() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const dna = await this.getDealerDNA();
    if (!dna) return [];

    const insights = [];

    if (dna.preferred_makes && dna.preferred_makes.length > 0) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count, error } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .in('make', dna.preferred_makes)
        .gte('created_at', sevenDaysAgo.toISOString())
        .eq('status', 'available');

      if (!error && count > 0) {
        insights.push({
          type: 'info',
          title: `🎯 ${count} new listings match your preferred makes`,
          description: `Check out the latest ${dna.preferred_makes.slice(0, 3).join(', ')} models.`,
          action: `/search?makes=${dna.preferred_makes.join(',')}&days=7`,
        });
      }
    }

    if (dna.deal_breakers && dna.deal_breakers.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Avoid these deal breakers',
        description: `You tend to avoid ${dna.deal_breakers.slice(0, 3).join(', ')}. We'll filter them out.`,
      });
    }

    return insights;
  },
};