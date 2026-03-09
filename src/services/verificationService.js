import { supabase } from '../lib/supabase';

export const verificationService = {
  // Submit a verification request
  async createRequest(documentUrls) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('verification_requests')
      .insert([{
        dealer_id: user.id,
        document_urls: documentUrls,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get dealer's own request
  async getMyRequest() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('dealer_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Get all requests (admin)
  async getAllRequests(status = null) {
    let query = supabase
      .from('verification_requests')
      .select(`
        *,
        dealer:dealers(business_name, phone, email, paid_deals)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Update request status (admin)
  async updateRequestStatus(requestId, status, adminNotes = '') {
    const { error } = await supabase
      .from('verification_requests')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date(),
      })
      .eq('id', requestId);

    if (error) throw error;

    // If approved, update dealer's verified status and badge
    if (status === 'approved') {
      const { data: request } = await supabase
        .from('verification_requests')
        .select('dealer_id')
        .eq('id', requestId)
        .single();

      if (request) {
        await supabase
          .from('dealers')
          .update({ verified: true, badge: 'verified' })
          .eq('id', request.dealer_id);

        // Create notification
        await supabase
          .from('notifications')
          .insert([{
            dealer_id: request.dealer_id,
            type: 'badge',
            title: '✅ Verification Approved',
            message: 'Your dealer account has been verified. You now have a verified badge!',
          }]);
      }
    }

    return true;
  },
};