import { useState } from 'react';
import { useAuth } from './useAuth';
import { subscriptionService } from '../services/subscriptionService';
import PaystackPop from '@paystack/inline-js';
import { generateReference } from '../utils/helpers';
import { PLAN_DETAILS } from '../utils/constants'; // 👈 import plan details
import toast from 'react-hot-toast';

export const useSubscription = () => {
  const { user, refreshDealer } = useAuth();
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan) => {
    if (!user) {
      toast.error('Please login');
      return { success: false };
    }

    // Get plan details from constants
    const planDetails = PLAN_DETAILS[plan];
    if (!planDetails) {
      toast.error('Invalid plan');
      return { success: false };
    }

    const planCode = subscriptionService.getPaystackPlanCode(plan);
    if (!planCode) {
      toast.error('Paystack plan code not configured');
      return { success: false };
    }

    setLoading(true);

    return new Promise((resolve) => {
      const paystack = new PaystackPop();
      const reference = generateReference('SUB');

      paystack.newTransaction({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: planDetails.price * 100, // convert to kobo using actual price
        currency: 'NGN',
        ref: reference,
        plan: planCode, // this creates a subscription
        metadata: {
          type: 'subscription',
          plan,
          user_id: user.id,
        },
        onSuccess: async (transaction) => {
          try {
            // Wait for webhook to update database, but show success immediately
            toast.success('Payment successful! Your subscription is being activated.');
            // Optionally, you can poll or wait a bit before refreshing dealer
            setTimeout(async () => {
              await refreshDealer();
            }, 3000);
            resolve({ success: true, transaction });
          } catch (error) {
            toast.error(error.message);
            resolve({ success: false, error });
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          toast.error('Payment cancelled');
          resolve({ success: false, cancelled: true });
          setLoading(false);
        },
        onError: (error) => {
          toast.error('Payment failed');
          console.error('Paystack error:', error);
          resolve({ success: false, error });
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