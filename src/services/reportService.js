import { supabase } from '../lib/supabase';

export const reportService = {
  // Submit a report
  async createReport(listingId, reason, description = '') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reports')
      .insert([{
        listing_id: listingId,
        reporter_id: user.id,
        reason,
        description,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all reports (admin only)
  async getReports(status = null) {
    let query = supabase
      .from('reports')
      .select(`
        *,
        listing:listings(*),
        reporter:dealers!reporter_id(business_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Update report status (admin)
  async updateReportStatus(reportId, status) {
    const { error } = await supabase
      .from('reports')
      .update({ status, updated_at: new Date() })
      .eq('id', reportId);

    if (error) throw error;
    return true;
  },

  // Delete a report (admin)
  async deleteReport(reportId) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
    return true;
  },
};