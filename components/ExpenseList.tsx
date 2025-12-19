
import React from 'react';
import { Expense, Category } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case Category.FOOD: return 'fa-utensils';
    case Category.TRANSPORT: return 'fa-car';
    case Category.SHOPPING: return 'fa-bag-shopping';
    case Category.UTILITIES: return 'fa-bolt';
    case Category.ENTERTAINMENT: return 'fa-film';
    case Category.HEALTH: return 'fa-heart-pulse';
    default: return 'fa-tag';
  }
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const today = new Date().toDateString();
  const todaysExpenses = expenses.filter(e => new Date(e.date).toDateString() === today);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          {todaysExpenses.length} today
        </span>
      </div>
      <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
        {expenses.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <i className="fa-solid fa-receipt text-4xl mb-3 block"></i>
            No expenses recorded yet.
          </div>
        ) : (
          expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
            <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600">
                  <i className={`fa-solid ${getCategoryIcon(expense.category)}`}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800 capitalize">{expense.description}</p>
                  <p className="text-xs text-gray-400">{expense.category} • {new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-gray-700">-₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <button 
                  onClick={() => onDelete(expense.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
