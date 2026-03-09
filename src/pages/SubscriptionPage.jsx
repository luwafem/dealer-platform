import React, { useEffect } from 'react';
import SubscriptionPlans from '../components/payments/SubscriptionPlans';
import SubscriptionCard from '../components/payments/SubscriptionCard';
import { useAuth } from '../hooks/useAuth';

const SubscriptionPage = () => {
  const { user } = useAuth();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Subscription <br /> Plans
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Choose the plan that fits your business
          </p>
        </div>

        {/* Current subscription card (only if logged in) */}
        {user && (
          <div className="mb-8">
            <SubscriptionCard />
          </div>
        )}

        {/* All plans */}
        <SubscriptionPlans />
      </div>
    </div>
  );
};

export default SubscriptionPage;