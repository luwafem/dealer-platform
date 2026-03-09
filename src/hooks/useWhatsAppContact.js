import { useState } from 'react';
import { useAuth } from './useAuth';
import { whatsappService } from '../services/whatsappService';
import PaystackPop from '@paystack/inline-js';
import { WHATSAPP_CONTACT_FEE } from '../utils/constants';
import { generateReference } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useWhatsAppContact = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initiateContact = async (sellerId, listingId) => {
    if (!user) {
      toast.error('Please login to contact seller');
      return { success: false };
    }

    setLoading(true);
    try {
      // Verify seller exists
      await whatsappService.canContact(sellerId);

      // Open Paystack payment modal
      const paystack = new PaystackPop();
      const reference = generateReference('WA');

      return new Promise((resolve) => {
        paystack.newTransaction({
          key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
          email: user.email,
          amount: WHATSAPP_CONTACT_FEE * 100, // convert to kobo
          currency: 'NGN',
          ref: reference,
          metadata: {
            buyer_id: user.id,
            seller_id: sellerId,
            listing_id: listingId,
          },
          onSuccess: async (transaction) => {
            console.log('Paystack transaction object:', JSON.stringify(transaction, null, 2));
            try {
              if (!transaction) {
                throw new Error('No transaction data received');
              }

              // Get reference - try multiple possible fields
              const paymentReference = transaction.reference || transaction.trxref || transaction.data?.reference;
              if (!paymentReference) {
                throw new Error('No payment reference received from Paystack');
              }

              // Get amount - try multiple possible paths
              let amountInKobo = transaction.amount;
              if (!amountInKobo && transaction.data?.amount) {
                amountInKobo = transaction.data.amount;
              }
              if (!amountInKobo) {
                // Fallback to the expected amount (WHATSAPP_CONTACT_FEE * 100)
                console.warn('Amount missing from transaction, using constant fee');
                amountInKobo = WHATSAPP_CONTACT_FEE * 100;
              }

              // Ensure amount is a positive number
              amountInKobo = Number(amountInKobo);
              if (isNaN(amountInKobo) || amountInKobo <= 0) {
                throw new Error(`Invalid payment amount: ${amountInKobo}`);
              }

              const amountInNaira = amountInKobo / 100;

              await whatsappService.recordContact(
                user.id,
                sellerId,
                listingId,
                paymentReference,
                amountInNaira
              );
              toast.success('Payment successful! Opening WhatsApp...');
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
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      return { success: false, error };
    }
  };

  return {
    initiateContact,
    loading,
  };
};