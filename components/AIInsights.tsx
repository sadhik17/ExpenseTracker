
import React, { useState } from 'react';
import { Expense, AIInsight } from '../types';
import { analyzeSpending } from '../services/geminiService';

interface AIInsightsProps {
  expenses: Expense[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    if (expenses.length === 0) return;
    setLoading(true);
    try {
      const result = await analyzeSpending(expenses);
      setInsight(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sentimentStyles = {
    frugal: 'bg-green-100 text-green-700',
    balanced: 'bg-blue-100 text-blue-700',
    extravagant: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">AI Spending Assistant</h3>
        </div>
        <button
          onClick={getInsight}
          disabled={loading || expenses.length === 0}
          className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Refresh Insight'}
        </button>
      </div>

      {!insight ? (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500 mb-4">Click below to let Gemini AI analyze today's spending habits and give you personalized advice.</p>
          <button
            onClick={getInsight}
            disabled={loading || expenses.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-all shadow-md shadow-purple-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> Analyzing Habits...
              </span>
            ) : 'Analyze My Spending'}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${sentimentStyles[insight.sentiment]}`}>
              {insight.sentiment} mode
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed italic border-l-4 border-purple-200 pl-4">
            "{insight.summary}"
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Smart Saving Tips:</p>
            {insight.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                <i className="fa-solid fa-lightbulb text-amber-500 mt-1"></i>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
