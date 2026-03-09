import React from 'react';
import { useDNA } from '../../hooks/useDNA';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DNAInsights = () => {
  const { insights, loading } = useDNA();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Lightbulb className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No insights yet. Keep searching!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Personalized Insights</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          let Icon = TrendingUp;
          let bgColor = 'bg-blue-50';
          let textColor = 'text-blue-800';
          let borderColor = 'border-blue-200';

          if (insight.type === 'warning') {
            Icon = AlertTriangle;
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-200';
          } else if (insight.type === 'danger') {
            Icon = AlertTriangle;
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            borderColor = 'border-red-200';
          }

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${borderColor} ${bgColor} cursor-pointer hover:shadow-md transition`}
              onClick={() => insight.action && navigate(insight.action)}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>{insight.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DNAInsights;