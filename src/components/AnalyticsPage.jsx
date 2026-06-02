import { useEffect, useMemo, useState } from 'react'
import { fetchBudgets } from '../services/budgetApi'
import { fetchGoals } from '../services/goalApi'
import { fetchTransactions } from '../services/transactionApi'

function formatCurrency(amount) {
  return `INR ${Number(amount).toLocaleString('en-IN')}`
}

function isCurrentMonth(date) {
  const itemDate = new Date(date)
  const now = new Date()

  return itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() === now.getMonth()
}

function AnalyticsPage({ token }) {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadAnalytics() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const [transactionData, budgetData, goalData] = await Promise.all([
          fetchTransactions(token),
          fetchBudgets(token),
          fetchGoals(token),
        ])

        if (isActive) {
          setTransactions(transactionData)
          setBudgets(budgetData)
          setGoals(goalData)
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    setTimeout(loadAnalytics, 0)

    return () => {
      isActive = false
    }
  }, [token])

  async function handleRefreshInsights() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const [transactionData, budgetData, goalData] = await Promise.all([
        fetchTransactions(token),
        fetchBudgets(token),
        fetchGoals(token),
      ])

      setTransactions(transactionData)
      setBudgets(budgetData)
      setGoals(goalData)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const analytics = useMemo(() => {
    const monthlyTransactions = transactions.filter((transaction) =>
      isCurrentMonth(transaction.date),
    )

    const monthlyIncome = monthlyTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)

    const monthlyExpenses = monthlyTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)

    const savingsRate = monthlyIncome
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0

    const totalBudgetLimit = budgets.reduce(
      (total, budget) => total + Number(budget.limit || 0),
      0,
    )
    const totalBudgetSpent = budgets.reduce(
      (total, budget) => total + Number(budget.spent || 0),
      0,
    )
    const budgetUsage = totalBudgetLimit
      ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100)
      : 0

    const totalGoalTarget = goals.reduce(
      (total, goal) => total + Number(goal.target || 0),
      0,
    )
    const totalGoalSaved = goals.reduce(
      (total, goal) => total + Number(goal.saved || 0),
      0,
    )
    const goalProgress = totalGoalTarget
      ? Math.round((totalGoalSaved / totalGoalTarget) * 100)
      : 0

    const categoryTotals = monthlyTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((totals, transaction) => {
        const category = transaction.category || 'Uncategorized'

        return {
          ...totals,
          [category]: (totals[category] || 0) + Number(transaction.amount || 0),
        }
      }, {})

    const categorySpending = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((first, second) => second.amount - first.amount)
      .slice(0, 5)

    const highestCategoryAmount = Math.max(
      ...categorySpending.map((category) => category.amount),
      0,
    )
    const totalCategorySpending = categorySpending.reduce(
      (total, category) => total + category.amount,
      0,
    )

    return {
      metrics: [
        {
          id: 'monthly-income',
          label: 'Monthly income',
          value: formatCurrency(monthlyIncome),
          detail: `${monthlyTransactions.length} transactions this month`,
          tooltip: `Income recorded this month: ${formatCurrency(monthlyIncome)}`,
        },
        {
          id: 'monthly-expenses',
          label: 'Monthly expenses',
          value: formatCurrency(monthlyExpenses),
          detail: `${savingsRate}% savings rate`,
          tooltip: `Expenses this month: ${formatCurrency(monthlyExpenses)}. Savings rate: ${savingsRate}%`,
        },
        {
          id: 'budget-usage',
          label: 'Budget usage',
          value: `${budgetUsage}%`,
          detail: `${formatCurrency(totalBudgetSpent)} of ${formatCurrency(totalBudgetLimit)}`,
          tooltip: `Budget spent: ${formatCurrency(totalBudgetSpent)}. Budget limit: ${formatCurrency(totalBudgetLimit)}`,
        },
        {
          id: 'goal-progress',
          label: 'Goal progress',
          value: `${goalProgress}%`,
          detail: `${formatCurrency(totalGoalSaved)} saved`,
          tooltip: `Saved toward goals: ${formatCurrency(totalGoalSaved)} of ${formatCurrency(totalGoalTarget)}`,
        },
      ],
      categorySpending,
      highestCategoryAmount,
      totalCategorySpending,
    }
  }, [budgets, goals, transactions])

  return (
    <section className="module-page" aria-labelledby="analytics-title">
      <header className="module-header">
        <div>
          <p className="eyebrow">Spending intelligence</p>
          <h1 id="analytics-title">Analytics</h1>
          <p>
            Understand patterns across income, expenses, categories, and monthly
            cash flow.
          </p>
        </div>

        <button
          className="primary-action"
          type="button"
          onClick={handleRefreshInsights}
        >
          Refresh Insights
        </button>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <section
        className="summary-grid analytics-summary-grid"
        aria-label="Analytics summary"
      >
        {analytics.metrics.map((metric) => (
          <article
            className="summary-card analytics-metric-card"
            key={metric.id}
            data-tooltip={metric.tooltip}
            tabIndex="0"
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <article className="dashboard-card">
        <div className="card-heading">
          <h2>Category trend</h2>
          <span>Last 30 days</span>
        </div>

        <div className="analytics-bars" aria-label="Category spending chart">
          {isLoading ? (
            <p>Loading analytics...</p>
          ) : analytics.categorySpending.length ? (
            analytics.categorySpending.map((category) => (
              <span
                key={category.category}
                className="analytics-bar"
                data-tooltip={`${category.category}: ${formatCurrency(
                  category.amount,
                )} (${Math.round(
                  (category.amount / analytics.totalCategorySpending) * 100,
                )}% of category spending)`}
                tabIndex="0"
                style={{
                  height: `${Math.max(
                    (category.amount / analytics.highestCategoryAmount) * 100,
                    12,
                  )}%`,
                }}
              >
                {category.category}
              </span>
            ))
          ) : (
            <p>No expense transactions this month.</p>
          )}
        </div>
      </article>
    </section>
  )
}

export default AnalyticsPage
