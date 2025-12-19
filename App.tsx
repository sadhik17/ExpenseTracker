
import React, { useState, useEffect } from 'react';
import { Expense } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';

const STORAGE_KEY = 'spendwise_expenses';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved expenses", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      setExpenses([]);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-coins"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SpendWise<span className="text-indigo-600">AI</span></h1>
          </div>
          <button 
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
          >
            Clear Data
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form and Dashboard Summary */}
          <div className="lg:col-span-1 space-y-8">
            <ExpenseForm onAdd={addExpense} />
            <AIInsights expenses={expenses} />
          </div>

          {/* Right Column: Visualization and List */}
          <div className="lg:col-span-2 space-y-8">
            <Dashboard expenses={expenses} />
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>

        </div>
      </main>

      {/* Mobile Sticky Add Button - Optional enhancement if needed */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-indigo-600 rounded-full text-white shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
