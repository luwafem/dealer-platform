import { supabase } from '../lib/supabase';
import { PAYSTACK_PLANS } from '../utils/constants';

export const subscriptionService = {
  // Get Paystack plan code for a given plan
  getPaystackPlanCode(plan) {
    if (plan === 'pro') return PAYSTACK_PLANS.PRO;
    if (plan === 'enterprise') return PAYSTACK_PLANS.ENTERPRISE;
    return null;
  },

  // Create a subscription record after Paystack success
  async createSubscriptionFromPayment(userId, plan, paymentDetails, subscriptionCode) {
    const planPrices = { pro: 10000, enterprise: 25000 };
    const amount = planPrices[plan] || 0;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    const subscriptionData = {
      dealer_id: userId,
      plan,
      amount,
      end_date: expiry,
      status: 'active',
      payment_reference: paymentDetails.reference,
      provider_subscription_id: subscriptionCode,
      provider_plan_code: this.getPaystackPlanCode(plan),
      auto_renew: true,
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single();

    if (error) throw error;

    // Update dealer's subscription info
    await supabase
      .from('dealers')
      .update({
        subscription_plan: plan,
        subscription_expiry: expiry,
        subscription_auto_renew: true,
      })
      .eq('id', userId);

    return data;
  },

  // Cancel auto-renewal (update dealer and subscription)
  async cancelAutoRenew(subscriptionId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First, cancel at Paystack (optional, we'll just update DB for now)
    // In production, you'd also call Paystack API to cancel subscription

    const { error } = await supabase
      .from('dealers')
      .update({ subscription_auto_renew: false })
      .eq('id', user.id);

    if (error) throw error;

    await supabase
      .from('subscriptions')
      .update({ auto_renew: false })
      .eq('id', subscriptionId);

    return true;
  },

  // Handle Paystack webhook (to be called from Edge Function)
  async handleWebhook(event) {
    // event.data contains Paystack webhook payload
    const { event: eventType, data } = event;

    if (eventType === 'charge.success' && data.metadata?.type === 'subscription') {
      // Initial subscription payment
      const { plan, user_id } = data.metadata;
      await this.createSubscriptionFromPayment(
        user_id,
        plan,
        { reference: data.reference },
        data.subscription_code
      );
    }

    if (eventType === 'subscription.create') {
      // Subscription created (may not need separate)
    }

    if (eventType === 'invoice.create') {
      // Recurring payment succeeded – extend expiry
      const subscriptionCode = data.subscription.subscription_code;
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('dealer_id, plan')
        .eq('provider_subscription_id', subscriptionCode)
        .single();

      if (error) throw error;

      const newExpiry = new Date();
      newExpiry.setMonth(newExpiry.getMonth() + 1);

      await supabase
        .from('dealers')
        .update({ subscription_expiry: newExpiry })
        .eq('id', subscription.dealer_id);

      await supabase
        .from('subscriptions')
        .update({ end_date: newExpiry })
        .eq('provider_subscription_id', subscriptionCode);
    }

    if (eventType === 'subscription.disable') {
      // Subscription cancelled or expired – downgrade to basic
      const subscriptionCode = data.subscription_code;
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('dealer_id')
        .eq('provider_subscription_id', subscriptionCode)
        .single();

      if (subscription) {
        await supabase
          .from('dealers')
          .update({
            subscription_plan: 'basic',
            subscription_auto_renew: false,
          })
          .eq('id', subscription.dealer_id);

        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('provider_subscription_id', subscriptionCode);
      }
    }

    return true;
  },
};