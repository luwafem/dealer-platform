// netlify/functions/paystack-webhook.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { event: eventType, data } = payload;

    // Handle initial subscription payment
    if (eventType === 'charge.success' && data.metadata?.type === 'subscription') {
      const { plan, user_id } = data.metadata;
      const planPrices = { pro: 10000, enterprise: 25000 };
      const amount = planPrices[plan] || 0;
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);

      // Insert subscription record
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          dealer_id: user_id,
          plan,
          amount,
          end_date: expiry,
          status: 'active',
          payment_reference: data.reference,
          provider_subscription_id: data.subscription_code,
          provider_plan_code: data.plan?.plan_code,
          auto_renew: true,
        });

      if (subError) throw subError;

      // Update dealer
      await supabase
        .from('dealers')
        .update({
          subscription_plan: plan,
          subscription_expiry: expiry,
          subscription_auto_renew: true,
        })
        .eq('id', user_id);
    }

    // Handle recurring payment success
    if (eventType === 'invoice.create') {
      const subscriptionCode = data.subscription.subscription_code;
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('dealer_id')
        .eq('provider_subscription_id', subscriptionCode)
        .single();

      if (!error && subscription) {
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
    }

    // Handle subscription cancellation/expiry
    if (eventType === 'subscription.disable') {
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

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success' }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};