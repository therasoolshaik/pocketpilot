export const mockTransactions = [
  {
    id: 'txn-1',
    type: 'income',
    title: 'Salary',
    amount: '50000',
    category: 'Income',
    date: '2026-05-25',
    paymentMethod: 'Bank transfer',
    notes: 'Monthly salary credited',
  },
  {
    id: 'txn-2',
    type: 'expense',
    title: 'Food',
    amount: '250',
    category: 'Food',
    date: '2026-05-24',
    paymentMethod: 'UPI',
    notes: 'Lunch with team',
  },
  {
    id: 'txn-3',
    type: 'expense',
    title: 'Netflix',
    amount: '199',
    category: 'Subscriptions',
    date: '2026-05-22',
    paymentMethod: 'Card',
    notes: 'Monthly streaming plan',
  },
]

export const mockCategories = [
  {
    id: 'cat-1',
    name: 'Food',
    type: 'expense',
    icon: 'Dining',
    color: '#0f766e',
    monthlyLimit: '12000',
    description: 'Restaurants, groceries, and coffee',
  },
  {
    id: 'cat-2',
    name: 'Salary',
    type: 'income',
    icon: 'Work',
    color: '#2563eb',
    monthlyLimit: '',
    description: 'Primary monthly income',
  },
  {
    id: 'cat-3',
    name: 'Subscriptions',
    type: 'expense',
    icon: 'Apps',
    color: '#c2410c',
    monthlyLimit: '1500',
    description: 'Recurring software and media plans',
  },
]

export const mockBudgets = [
  {
    id: 'budget-1',
    category: 'Food',
    limit: 12000,
    spent: 7250,
    period: 'May 2026',
  },
  {
    id: 'budget-2',
    category: 'Transport',
    limit: 6000,
    spent: 3100,
    period: 'May 2026',
  },
  {
    id: 'budget-3',
    category: 'Subscriptions',
    limit: 1500,
    spent: 899,
    period: 'May 2026',
  },
]

export const mockGoals = [
  {
    id: 'goal-1',
    name: 'Emergency fund',
    target: 150000,
    saved: 86000,
    date: '2026-12-31',
  },
  {
    id: 'goal-2',
    name: 'New laptop',
    target: 90000,
    saved: 42000,
    date: '2026-09-15',
  },
  {
    id: 'goal-3',
    name: 'Vacation',
    target: 120000,
    saved: 36000,
    date: '2027-01-20',
  },
]

export const mockAnalytics = [
  {
    id: 'analytics-1',
    label: 'Monthly income',
    value: 'INR 50,000',
    change: '+8.4%',
  },
  {
    id: 'analytics-2',
    label: 'Monthly expenses',
    value: 'INR 22,480',
    change: '-3.2%',
  },
  {
    id: 'analytics-3',
    label: 'Savings rate',
    value: '55%',
    change: '+6.1%',
  },
]

export const mockSettings = [
  {
    id: 'setting-1',
    label: 'Default currency',
    value: 'INR',
    description: 'Used across transactions, budgets, and reports',
  },
  {
    id: 'setting-2',
    label: 'Monthly budget reset',
    value: '1st of every month',
    description: 'Controls budget period calculations',
  },
  {
    id: 'setting-3',
    label: 'Spending alerts',
    value: 'Enabled',
    description: 'Notify when budgets cross 80%',
  },
]
