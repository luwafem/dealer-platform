import { supabase } from '../lib/supabase';
import { WHATSAPP_CONTACT_FEE } from '../utils/constants';

export const whatsappService = {
  // Verify that the seller exists (no credit check)
  async canContact(dealerId) {
    if (!dealerId) throw new Error('Dealer ID is required');
    
    const { data, error } = await supabase
      .from('dealers')
      .select('id')
      .eq('id', dealerId)
      .single();

    if (error) {
      console.error('Error verifying seller:', error);
      throw new Error('Failed to verify seller');
    }

    return { canContact: true };
  },

  // Record a WhatsApp contact after successful payment
  async recordContact(buyerId, sellerId, listingId, paymentReference, amount) {
    if (!paymentReference || !amount) {
      throw new Error('Payment details are required');
    }

    const contactData = {
      buyer_id: buyerId,
      seller_id: sellerId,
      listing_id: listingId,
      contact_type: 'paid',
      amount_paid: amount, // in Naira
      payment_reference: paymentReference,
    };

    const { data, error } = await supabase
      .from('whatsapp_contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Error recording contact:', error);
      throw new Error('Failed to record WhatsApp contact');
    }

    return data;
  },

  // Get unique dealers who have contacted the seller about this listing
  async getPotentialBuyers(listingId, sellerId) {
    const { data, error } = await supabase
      .from('whatsapp_contacts')
      .select('buyer_id, buyer:dealers!buyer_id(id, business_name, phone)')
      .eq('listing_id', listingId)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Deduplicate by buyer_id
    const uniqueMap = new Map();
    data.forEach(item => {
      if (!uniqueMap.has(item.buyer_id)) {
        uniqueMap.set(item.buyer_id, item.buyer);
      }
    });
    return Array.from(uniqueMap.values());
  },

  // Get contact history for a dealer (as buyer or seller)
  async getContactHistory(dealerId) {
    if (!dealerId) throw new Error('Dealer ID is required');

    const { data, error } = await supabase
      .from('whatsapp_contacts')
      .select(`
        *,
        buyer:dealers!buyer_id(business_name, phone),
        seller:dealers!seller_id(business_name, phone),
        listing:listings(make, model, year, photos)
      `)
      .or(`buyer_id.eq.${dealerId},seller_id.eq.${dealerId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact history:', error);
      throw new Error('Failed to load contact history');
    }

    return data;
  },
};