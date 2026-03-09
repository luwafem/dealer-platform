import React from 'react';
import { useDNA } from '../../hooks/useDNA';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DNAInsights = () => {
  const { insights, loading } = useDNA();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 border-2 border-black w-3/4"></div>
          <div className="h-4 bg-gray-300 border-2 border-black"></div>
          <div className="h-4 bg-gray-300 border-2 border-black w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
        <Lightbulb size={40} strokeWidth={2} className="mx-auto mb-2 text-black" />
        <p className="font-bold">No insights yet. Keep searching!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} strokeWidth={2} className="text-black" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Personalized Insights</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          let Icon = TrendingUp;
          let bgColor = 'bg-blue-100';
          if (insight.type === 'warning') {
            Icon = AlertTriangle;
            bgColor = 'bg-yellow-100';
          } else if (insight.type === 'danger') {
            Icon = AlertTriangle;
            bgColor = 'bg-red-100';
          }

          return (
            <div
              key={idx}
              className={`p-3 border-2 border-black ${bgColor} cursor-pointer hover:bg-yellow-200 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              onClick={() => insight.action && navigate(insight.action)}
            >
              <div className="flex items-start gap-3">
                <Icon size={20} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-black" />
                <div>
                  <p className="font-black uppercase text-sm">{insight.title}</p>
                  <p className="text-xs font-bold mt-1">{insight.description}</p>
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