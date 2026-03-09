import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { PLAN_DETAILS, SUBSCRIPTION_PLANS } from '../../utils/constants';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionPlans = () => {
  const { user, dealer } = useAuth();
  const { subscribe, loading } = useSubscription();

  const handleSubscribe = async (planKey) => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    const result = await subscribe(planKey);
    if (result.success) {
      // subscription successful, UI will update via dealer context
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-8">
      {Object.values(SUBSCRIPTION_PLANS).map((planKey) => {
        const plan = PLAN_DETAILS[planKey];
        const isCurrentPlan = dealer?.subscription_plan === planKey;
        const isPaid = plan.price > 0;

        return (
          <div
            key={planKey}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${
              isCurrentPlan ? 'border-blue-600' : 'border-transparent'
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                {plan.price === 0 ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold">₦{plan.price.toLocaleString()}</span>
                    <span className="text-gray-500">/month</span>
                  </>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-50">
              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(planKey)}
                  disabled={loading}
                  className={`w-full px-4 py-2 rounded-md ${
                    isPaid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Processing...' : isPaid ? `Subscribe to ${plan.name}` : 'Switch to Free'}
                </button>
              )}
              {!user && isPaid && (
                <p className="text-xs text-gray-500 text-center mt-2">Please log in to subscribe</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;