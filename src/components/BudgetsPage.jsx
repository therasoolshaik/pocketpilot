import { useEffect, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import BudgetModal from './BudgetModal'
import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from '../services/budgetApi'
import { fetchCategories } from '../services/categoryApi'

function BudgetsPage({ token }) {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [budgetToEdit, setBudgetToEdit] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredBudgets = normalizedSearchQuery
    ? budgets.filter((budget) =>
        [
          budget.category,
          budget.limit,
          budget.spent,
          budget.period,
          budget.periodLabel,
        ]
          .filter((value) => value !== undefined && value !== null)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearchQuery),
          ),
      )
    : budgets

  useEffect(() => {
    let isActive = true

    async function loadBudgets() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const [budgetData, categoryData] = await Promise.all([
          fetchBudgets(token),
          fetchCategories(token),
        ])

        if (isActive) {
          setBudgets(budgetData)
          setCategories(categoryData)
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

    loadBudgets()

    return () => {
      isActive = false
    }
  }, [token])

  async function handleSaveBudget(budget) {
    try {
      setErrorMessage('')
      const savedBudget = budgetToEdit
        ? await updateBudget(token, budget)
        : await createBudget(token, budget)

      setBudgets((currentBudgets) => {
        const exists = currentBudgets.some((item) => item.id === savedBudget.id)

        if (exists) {
          return currentBudgets.map((item) =>
            item.id === savedBudget.id ? savedBudget : item,
          )
        }

        return [savedBudget, ...currentBudgets]
      })

      setIsModalOpen(false)
      setBudgetToEdit(null)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  async function handleDeleteBudget(budgetId) {
    try {
      setErrorMessage('')
      await deleteBudget(token, budgetId)
      setBudgets((currentBudgets) =>
        currentBudgets.filter((item) => item.id !== budgetId),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setBudgetToEdit(null)
  }

  return (
    <section className="module-page" aria-labelledby="budgets-title">
      <header className="module-header module-toolbar-header">
        <div>
          <p className="eyebrow">Spending control</p>
          <h1 id="budgets-title">Budgets</h1>
          <p>
            Set monthly limits, monitor category spending, and stay ahead of
            overspending before it happens.
          </p>
        </div>

        <div className="module-toolbar">
          <label
            className="module-search compact-search"
            htmlFor="budgets-search"
            aria-label="Search budgets"
          >
            <div className="search-input-wrap">
              <Search size={17} strokeWidth={2.2} aria-hidden="true" />
              <input
                id="budgets-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search budgets"
              />
            </div>
          </label>

          <button
            className="primary-action"
            type="button"
            onClick={() => {
              setBudgetToEdit(null)
              setIsModalOpen(true)
            }}
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>Create Budget</span>
          </button>
        </div>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <section className="budget-list" aria-label="Budget list">
        {isLoading ? (
          <article className="dashboard-card">
            <p>Loading budgets...</p>
          </article>
        ) : budgets.length ? (
          filteredBudgets.length ? (
            filteredBudgets.map((budget) => {
          const percent = budget.limit
            ? Math.min((budget.spent / budget.limit) * 100, 100)
            : 0
          const remaining = budget.limit - budget.spent

          return (
            <article className="dashboard-card" key={budget.id}>
              <div className="card-heading">
                <h2>{budget.category}</h2>
                <span>{budget.periodLabel}</span>
              </div>

              <div className="budget-meter" aria-hidden="true">
                <span style={{ width: `${percent}%` }}></span>
              </div>

              <div className="budget-details">
                <span>
                  INR {budget.spent.toLocaleString('en-IN')} spent
                </span>
                <strong>
                  {remaining >= 0
                    ? `INR ${remaining.toLocaleString('en-IN')} left`
                    : `INR ${Math.abs(remaining).toLocaleString('en-IN')} over`}
                </strong>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  onClick={() => {
                    setBudgetToEdit(budget)
                    setIsModalOpen(true)
                  }}
                  aria-label={`Edit ${budget.category} budget`}
                >
                  <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBudget(budget.id)}
                  aria-label={`Delete ${budget.category} budget`}
                >
                  <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
            </article>
          )
        })
          ) : (
            <article className="dashboard-card">
              <p>No budgets match your search.</p>
            </article>
          )
        ) : (
          <article className="dashboard-card">
            <p>No budgets yet. Create one from an expense category.</p>
          </article>
        )}
      </section>

      {isModalOpen && (
        <BudgetModal
          categories={categories}
          budgetToEdit={budgetToEdit}
          onClose={handleCloseModal}
          onSaveBudget={handleSaveBudget}
        />
      )}
    </section>
  )
}

export default BudgetsPage
