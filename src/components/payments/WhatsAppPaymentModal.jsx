import React, { useState } from 'react';
import { X, Phone, CreditCard } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';
import { WHATSAPP_CONTACT_FEE } from '../../utils/constants';
import { useWhatsAppCredits } from '../../hooks/useWhatsAppContact';
import { useAuth } from '../../hooks/useAuth';

const WhatsAppPaymentModal = ({ isOpen, onClose, sellerId, listingId, onSuccess }) => {
  const { user } = useAuth();
  const { topUpCredits } = useWhatsAppCredits();
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setProcessing(true);
    const paystack = new PaystackPop();
    const ref = `wa_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: user?.email || 'customer@example.com',
      amount: WHATSAPP_CONTACT_FEE * 100, // convert to kobo
      currency: 'NGN',
      ref,
      onSuccess: async (transaction) => {
        setProcessing(false);
        const result = await topUpCredits(transaction.amount, sellerId, listingId, transaction.reference);
        if (result.success) {
          onSuccess?.();
          onClose();
        }
      },
      onCancel: () => {
        setProcessing(false);
      },
      onError: (error) => {
        setProcessing(false);
        console.error('Paystack error:', error);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No WhatsApp Credits</h2>
            <p className="text-gray-600 mt-2">
              You need 1 credit to contact this seller. Purchase a credit for ₦{WHATSAPP_CONTACT_FEE} to proceed.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">WhatsApp Contact</span>
              <span className="font-semibold">₦{WHATSAPP_CONTACT_FEE}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <CreditCard size={20} />
            <span>{processing ? 'Processing...' : 'Pay with Paystack'}</span>
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            You will be charged ₦{WHATSAPP_CONTACT_FEE} for one WhatsApp contact. After payment, you'll be redirected to WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPaymentModal;