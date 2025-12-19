
export enum Category {
  FOOD = 'Food & Drink',
  TRANSPORT = 'Transport',
  SHOPPING = 'Shopping',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  OTHER = 'Other'
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
}

export interface AIInsight {
  summary: string;
  tips: string[];
  sentiment: 'frugal' | 'balanced' | 'extravagant';
}
