import React, { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { generateReference } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PaystackButton = ({
  amount, // in Naira
  email,
  metadata = {},
  onSuccess,
  onClose,
  onError,
  buttonText = 'Pay Now',
  className = '',
  disabled = false,
}) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!amount || amount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    setProcessing(true);
    const paystack = new PaystackPop();
    const reference = generateReference('PAY');

    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // convert to kobo
      currency: 'NGN',
      ref: reference,
      metadata,
      onSuccess: (transaction) => {
        setProcessing(false);
        toast.success('Payment successful!');
        onSuccess?.(transaction);
      },
      onCancel: () => {
        setProcessing(false);
        toast.error('Payment cancelled');
        onClose?.();
      },
      onError: (error) => {
        setProcessing(false);
        toast.error('Payment failed');
        console.error('Paystack error:', error);
        onError?.(error);
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={processing || disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {processing ? 'Processing...' : buttonText}
    </button>
  );
};

export default PaystackButton;