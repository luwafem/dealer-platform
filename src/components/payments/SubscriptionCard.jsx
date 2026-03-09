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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="text-2xl font-bold text-blue-600">{planDetails.name}</p>
          </div>
          {isPaid && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {isPaid ? (
            <>
              <div className="flex items-center text-sm">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <span>
                  Renews on {expiryDate ? formatDate(expiryDate) : 'N/A'}
                </span>
                {isExpiringSoon && (
                  <span className="ml-2 text-yellow-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    Expiring soon
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <CreditCard size={16} className="mr-2 text-gray-400" />
                <span>
                  Auto-renew: {dealer.subscription_auto_renew ? 'On' : 'Off'}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Free plan – upgrade to unlock more features.</p>
          )}
        </div>

        {isPaid && dealer.subscription_auto_renew && (
          <button
            onClick={cancelAutoRenew}
            className="mt-4 text-sm text-red-600 hover:text-red-700"
          >
            Cancel auto-renewal
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;