import React from 'react';
import SubscriptionPlans from '../components/payments/SubscriptionPlans';
import SubscriptionCard from '../components/payments/SubscriptionCard';
import { useAuth } from '../hooks/useAuth';

const SubscriptionPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>
      {user && (
        <div className="mb-8">
          <SubscriptionCard />
        </div>
      )}
      <SubscriptionPlans />
    </div>
  );
};

export default SubscriptionPage;