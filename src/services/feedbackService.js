import { supabase } from '../lib/supabase';

export const feedbackService = {
  async submitFeedback({ user_id, name, email, type, message }) {
    const { error } = await supabase
      .from('feedback')
      .insert([{ user_id, name, email, type, message }]);
    if (error) throw error;
  },

  async getFeedback(status = null) {
    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateFeedbackStatus(id, status) {
    const { error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },
};