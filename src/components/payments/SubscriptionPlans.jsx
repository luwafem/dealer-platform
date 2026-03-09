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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {Object.values(SUBSCRIPTION_PLANS).map((planKey) => {
        const plan = PLAN_DETAILS[planKey];
        const isCurrentPlan = dealer?.subscription_plan === planKey;
        const isPaid = plan.price > 0;

        return (
          <div
            key={planKey}
            className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              isCurrentPlan ? 'relative' : ''
            }`}
          >
            {isCurrentPlan && (
              <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Current
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{plan.name}</h3>
              <div className="mt-2 border-t-2 border-black pt-2">
                {plan.price === 0 ? (
                  <span className="text-4xl font-black">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-black">₦{plan.price.toLocaleString()}</span>
                    <span className="text-sm font-bold uppercase ml-1">/month</span>
                  </>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check size={18} className="mr-2 flex-shrink-0" strokeWidth={2} />
                    <span className="text-sm font-bold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border-t-2 border-black bg-gray-100">
              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full border-2 border-black bg-gray-300 text-black px-4 py-2 font-black uppercase cursor-not-allowed opacity-50"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(planKey)}
                  disabled={loading}
                  className={`w-full border-2 border-black px-4 py-2 font-black uppercase transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    isPaid
                      ? 'bg-yellow-400 text-black hover:bg-black hover:text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : isPaid ? `Subscribe` : 'Switch to Free'}
                </button>
              )}
              {!user && isPaid && (
                <p className="text-xs font-bold text-center mt-2">Please log in to subscribe</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;