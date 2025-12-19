
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Category } from '../types';

interface DashboardProps {
  expenses: Expense[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const dailyTotal = useMemo(() => {
    const today = new Date().toDateString();
    return expenses
      .filter(e => new Date(e.date).toDateString() === today)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const BUDGET_GOAL = 1000;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <p className="text-indigo-100 font-medium">Today's Spending</p>
          <h3 className="text-4xl font-bold mt-1">₹{dailyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          <p className="text-indigo-200 text-sm mt-4">
            <i className="fa-solid fa-calendar-day mr-1"></i> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-gray-500 font-medium mb-2">Daily Goal Status</p>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${dailyTotal > BUDGET_GOAL ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((dailyTotal / BUDGET_GOAL) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Budget goal: ₹{BUDGET_GOAL.toLocaleString('en-IN')} / day</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Spending by Category</h3>
        <div className="h-64 w-full">
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Add expenses to see visualization
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
