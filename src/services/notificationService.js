import { supabase } from '../lib/supabase';

export const notificationService = {
  // Subscribe to real-time notifications
  subscribeToNotifications(dealerId, callback) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `dealer_id=eq.${dealerId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  },

  // Fetch all notifications for current user
  async getNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get unread count
  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', user.id)
      .eq('read', false);

    if (error) throw error;
    return count;
  },

  // Mark a notification as read
  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  },

  // Mark all as read
  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('dealer_id', user.id)
      .eq('read', false);

    if (error) throw error;
    return true;
  },

  // Create a notification (for system use)
  async createNotification(dealerId, type, title, message, data = {}) {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        dealer_id: dealerId,
        type,
        title,
        message,
        data,
        read: false,
      }]);

    if (error) throw error;
    return true;
  },
};