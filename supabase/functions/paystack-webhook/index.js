import { serve } from 'https://deno.land/std@0.168.0/http/server.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const payload = await req.json();
    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    // Optional: verify Paystack signature here

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { event, data } = payload;

    // Handle initial subscription payment
    if (event === 'charge.success' && data.metadata?.type === 'subscription') {
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
          provider_plan_code: data.plan.plan_code,
          auto_renew: true,
        });

      if (subError) throw subError;

      // Update dealer's subscription info
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
    if (event === 'invoice.create') {
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
    if (event === 'subscription.disable') {
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

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});