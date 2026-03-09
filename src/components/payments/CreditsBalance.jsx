import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Phone, Zap } from 'lucide-react';

const CreditsBalance = () => {
  const { dealer } = useAuth();

  if (!dealer) return null;

  const isEnterprise = dealer.subscription_plan === 'enterprise';
  const credits = dealer.whatsapp_credits;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">WhatsApp Credits</p>
            <p className="text-xl font-semibold">
              {isEnterprise ? 'Unlimited' : credits}
            </p>
          </div>
        </div>
        {isEnterprise && (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            <Zap size={16} className="mr-1" />
            <span className="text-xs font-medium">Enterprise</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditsBalance;