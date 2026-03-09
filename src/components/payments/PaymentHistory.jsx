import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/paymentService';
import { formatNaira, formatDate } from '../../utils/formatters';
import { Receipt, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPayments();
    }
  }, [user]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getUserPayments();
      setPayments(data);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No payments yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Your payment history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Payment History</h3>
      </div>
      <div className="divide-y">
        {payments.map((payment) => (
          <div key={payment.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{payment.description || 'Payment'}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(payment.created_at)} • Ref: {payment.reference?.slice(0, 8)}...
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-900">{formatNaira(payment.amount)}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {payment.status}
              </span>
              {payment.receipt_url && (
                <a
                  href={payment.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Download size={18} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;