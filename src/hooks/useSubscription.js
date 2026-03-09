import { useState } from 'react';
import { useAuth } from './useAuth';
import { subscriptionService } from '../services/subscriptionService';
import PaystackPop from '@paystack/inline-js';
import { generateReference } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useSubscription = () => {
  const { user, refreshDealer } = useAuth();
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan) => {
    if (!user) {
      toast.error('Please login');
      return { success: false };
    }

    const planCode = subscriptionService.getPaystackPlanCode(plan);
    if (!planCode) {
      toast.error('Invalid plan');
      return { success: false };
    }

    setLoading(true);

    return new Promise((resolve) => {
      const paystack = new PaystackPop();
      const reference = generateReference('SUB');

      paystack.newTransaction({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: plan === 'pro' ? 10000 * 100 : 25000 * 100, // amount in kobo
        currency: 'NGN',
        ref: reference,
        plan: planCode, // 👈 this creates a subscription
        metadata: {
          type: 'subscription',
          plan,
          user_id: user.id,
        },
        onSuccess: async (transaction) => {
          try {
            // Subscription is created, but we'll wait for webhook to insert record
            // Or we could insert optimistically, but safer to let webhook handle it.
            toast.success('Subscription activated!');
            await refreshDealer();
            resolve({ success: true });
          } catch (error) {
            toast.error(error.message);
            resolve({ success: false });
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          toast.error('Payment cancelled');
          resolve({ success: false });
          setLoading(false);
        },
        onError: (error) => {
          toast.error('Payment failed');
          console.error(error);
          resolve({ success: false });
          setLoading(false);
        },
      });
    });
  };

  const cancelAutoRenew = async (subscriptionId) => {
    setLoading(true);
    try {
      await subscriptionService.cancelAutoRenew(subscriptionId);
      await refreshDealer();
      toast.success('Auto-renewal cancelled');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribe,
    cancelAutoRenew,
    loading,
  };
};