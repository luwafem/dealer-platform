import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { PLAN_DETAILS } from '../../utils/constants';
import { Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const SubscriptionCard = () => {
  const { dealer } = useAuth();
  const { subscription, loading, cancelAutoRenew } = useSubscription();

  if (!dealer) return null;

  const planDetails = PLAN_DETAILS[dealer.subscription_plan] || PLAN_DETAILS.basic;
  const isPaid = dealer.subscription_plan !== 'basic';
  const expiryDate = dealer.subscription_expiry ? new Date(dealer.subscription_expiry) : null;
  const isExpiringSoon = expiryDate && expiryDate - new Date() < 5 * 24 * 60 * 60 * 1000; // 5 days

  return (
    <div className="bg-white border-2 border-black">
      <div className="p-6">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 border-b-2 border-black pb-2">
          Current Subscription
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase mb-1">Plan</p>
            <p className="text-3xl font-black text-black">{planDetails.name}</p>
          </div>
          {isPaid && (
            <div className="border-2 border-black bg-black text-white px-3 py-1 text-sm font-black uppercase">
              Active
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {isPaid ? (
            <>
              <div className="flex items-center text-sm font-bold">
                <Calendar size={18} className="mr-2" strokeWidth={2} />
                <span>
                  Renews on {expiryDate ? formatDate(expiryDate) : 'N/A'}
                </span>
                {isExpiringSoon && (
                  <span className="ml-2 text-red-600 flex items-center font-black uppercase text-xs">
                    <AlertCircle size={14} className="mr-1" strokeWidth={2} />
                    Expiring soon
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm font-bold">
                <CreditCard size={18} className="mr-2" strokeWidth={2} />
                <span>
                  Auto-renew: {dealer.subscription_auto_renew ? 'On' : 'Off'}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm font-bold uppercase">
              Free plan – upgrade to unlock more features.
            </p>
          )}
        </div>

        {isPaid && dealer.subscription_auto_renew && (
          <button
            onClick={cancelAutoRenew}
            className="mt-4 border-2 border-black bg-white px-4 py-2 font-black uppercase text-sm hover:bg-black hover:text-white transition-colors"
          >
            Cancel auto-renewal
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;