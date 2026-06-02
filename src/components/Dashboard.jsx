import { useEffect, useMemo, useState } from 'react'
import AnalyticsPage from './AnalyticsPage'
import BudgetsPage from './BudgetsPage'
import CategoriesPage from './CategoriesPage'
import GoalsPage from './GoalsPage'
import SettingsPage from './SettingsPage'
import Sidebar from './Sidebar'
import TransactionsPage from './TransactionsPage'
import { fetchTransactions } from '../services/transactionApi'

function formatCurrency(amount) {
  return `INR ${Number(amount).toLocaleString('en-IN')}`
}

function formatTransactionAmount(transaction) {
  const prefix = transaction.type === 'income' ? '+' : '-'
  return `${prefix}${formatCurrency(transaction.amount)}`
}

function isCurrentMonth(date) {
  const transactionDate = new Date(date)
  const now = new Date()

  return (
    transactionDate.getFullYear() === now.getFullYear() &&
    transactionDate.getMonth() === now.getMonth()
  )
}

function Dashboard({ onLogout, token }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [isLoadingOverview, setIsLoadingOverview] = useState(false)
  const [overviewError, setOverviewError] = useState('')

  useEffect(() => {
    if (activeSection !== 'dashboard') {
      return undefined
    }

    let isActive = true

    async function loadOverview() {
      try {
        setIsLoadingOverview(true)
        setOverviewError('')
        const data = await fetchTransactions(token)

        if (isActive) {
          setTransactions(data)
        }
      } catch (error) {
        if (isActive) {
          setOverviewError(error.message)
        }
      } finally {
        if (isActive) {
          setIsLoadingOverview(false)
        }
      }
    }

    loadOverview()

    return () => {
      isActive = false
    }
  }, [activeSection, token])

  const overview = useMemo(() => {
    const totals = transactions.reduce(
      (currentTotals, transaction) => {
        const amount = Number(transaction.amount) || 0
        const bucket = transaction.type === 'income' ? 'income' : 'expense'

        return {
          ...currentTotals,
          [bucket]: currentTotals[bucket] + amount,
        }
      },
      { income: 0, expense: 0 },
    )

    const monthlyTotals = transactions
      .filter((transaction) => isCurrentMonth(transaction.date))
      .reduce(
        (currentTotals, transaction) => {
          const amount = Number(transaction.amount) || 0
          const bucket = transaction.type === 'income' ? 'income' : 'expense'

          return {
            ...currentTotals,
            [bucket]: currentTotals[bucket] + amount,
          }
        },
        { income: 0, expense: 0 },
      )

    const balance = totals.income - totals.expense
    const savingsRate = monthlyTotals.income
      ? Math.round(
          ((monthlyTotals.income - monthlyTotals.expense) / monthlyTotals.income) *
            100,
        )
      : 0
    const spendingRatio = monthlyTotals.income
      ? Math.min(Math.round((monthlyTotals.expense / monthlyTotals.income) * 100), 100)
      : 0

    return {
      balance,
      monthlyIncome: monthlyTotals.income,
      monthlyExpense: monthlyTotals.expense,
      recentTransactions: transactions.slice(0, 4),
      savingsRate,
      spendingRatio,
    }
  }, [transactions])

  const summaryCards = [
    {
      label: 'Total balance',
      value: formatCurrency(overview.balance),
      meta: `${transactions.length} saved transactions`,
    },
    {
      label: 'Monthly income',
      value: formatCurrency(overview.monthlyIncome),
      meta: 'Income recorded this month',
    },
    {
      label: 'Monthly spending',
      value: formatCurrency(overview.monthlyExpense),
      meta: `${overview.savingsRate}% savings rate`,
    },
  ]

  return (
    <main className="app-shell">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />

      <div className="dashboard-page">
        {activeSection === 'transactions' ? (
          <TransactionsPage token={token} />
        ) : activeSection === 'categories' ? (
          <CategoriesPage token={token} />
        ) : activeSection === 'budgets' ? (
          <BudgetsPage token={token} />
        ) : activeSection === 'goals' ? (
          <GoalsPage token={token} />
        ) : activeSection === 'analytics' ? (
          <AnalyticsPage token={token} />
        ) : activeSection === 'settings' ? (
          <SettingsPage token={token} />
        ) : (
          <>
            <section className="dashboard-hero" aria-labelledby="dashboard-title">
              <div>
                <p className="eyebrow">Today overview</p>
                <h1 id="dashboard-title">
                  {transactions.length
                    ? 'Your money snapshot is ready.'
                    : 'Start with your first transaction.'}
                </h1>
                <p>
                  {transactions.length
                    ? 'This dashboard now reflects the income and expenses you have saved.'
                    : 'Add income and expenses to see balance, spending, and recent activity here.'}
                </p>
              </div>
            </section>

            {overviewError && <p className="form-error">{overviewError}</p>}

            <section className="summary-grid" aria-label="Account summary">
              {summaryCards.map((card) => (
                <article className="summary-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.meta}</p>
                </article>
              ))}
            </section>

            <section className="dashboard-grid">
              <article className="dashboard-card">
                <div className="card-heading">
                  <h2>Spending health</h2>
                  <span>This month</span>
                </div>

                <div className="budget-meter" aria-hidden="true">
                  <span style={{ width: `${overview.spendingRatio}%` }}></span>
                </div>

                <div className="budget-details">
                  <span>Spent {formatCurrency(overview.monthlyExpense)}</span>
                  <strong>{overview.spendingRatio}% of income</strong>
                </div>
              </article>

              <article className="dashboard-card">
                <div className="card-heading">
                  <h2>Recent transactions</h2>
                  <span>Latest</span>
                </div>

                <div className="transaction-list">
                  {isLoadingOverview ? (
                    <p>Loading transactions...</p>
                  ) : overview.recentTransactions.length ? (
                    overview.recentTransactions.map((transaction) => (
                      <div className="transaction-row" key={transaction.id}>
                        <div>
                          <strong>{transaction.title}</strong>
                          <span>{transaction.category}</span>
                        </div>
                        <b>{formatTransactionAmount(transaction)}</b>
                      </div>
                    ))
                  ) : (
                    <p>No transactions yet.</p>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default Dashboard
