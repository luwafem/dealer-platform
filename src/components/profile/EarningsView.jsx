import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

const EarningsView = ({ earnings }) => {
  if (!earnings) return null;

  const { totalSales, totalFees, netEarnings, count } = earnings;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Earnings Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-700">{formatNaira(totalSales)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Fees Paid</p>
              <p className="text-2xl font-bold text-red-700">{formatNaira(totalFees)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Net Earnings</p>
              <p className="text-2xl font-bold text-blue-700">{formatNaira(netEarnings)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{count} completed sales</p>
    </div>
  );
};

export default EarningsView;