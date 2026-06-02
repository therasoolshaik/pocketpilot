import { useEffect, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import GoalModal from './GoalModal'
import {
  createGoal,
  deleteGoal,
  fetchGoals,
  updateGoal,
} from '../services/goalApi'

function GoalsPage({ token }) {
  const [goals, setGoals] = useState([])
  const [goalToEdit, setGoalToEdit] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredGoals = normalizedSearchQuery
    ? goals.filter((goal) =>
        [goal.name, goal.target, goal.saved, goal.date]
          .filter((value) => value !== undefined && value !== null)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearchQuery),
          ),
      )
    : goals

  useEffect(() => {
    let isActive = true

    async function loadGoals() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const data = await fetchGoals(token)

        if (isActive) {
          setGoals(data)
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

    loadGoals()

    return () => {
      isActive = false
    }
  }, [token])

  async function handleSaveGoal(goal) {
    try {
      setErrorMessage('')
      const savedGoal = goalToEdit
        ? await updateGoal(token, goal)
        : await createGoal(token, goal)

      setGoals((currentGoals) => {
        const exists = currentGoals.some((item) => item.id === savedGoal.id)

        if (exists) {
          return currentGoals.map((item) =>
            item.id === savedGoal.id ? savedGoal : item,
          )
        }

        return [savedGoal, ...currentGoals]
      })

      setIsModalOpen(false)
      setGoalToEdit(null)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  async function handleDeleteGoal(goalId) {
    try {
      setErrorMessage('')
      await deleteGoal(token, goalId)
      setGoals((currentGoals) =>
        currentGoals.filter((item) => item.id !== goalId),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setGoalToEdit(null)
  }

  return (
    <section className="module-page" aria-labelledby="goals-title">
      <header className="module-header module-toolbar-header">
        <div>
          <p className="eyebrow">Future planning</p>
          <h1 id="goals-title">Goals</h1>
          <p>
            Track savings targets for emergency funds, trips, purchases, and
            long-term money milestones.
          </p>
        </div>

        <div className="module-toolbar">
          <label
            className="module-search compact-search"
            htmlFor="goals-search"
            aria-label="Search goals"
          >
            <div className="search-input-wrap">
              <Search size={17} strokeWidth={2.2} aria-hidden="true" />
              <input
                id="goals-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search goals"
              />
            </div>
          </label>

          <button
            className="primary-action"
            type="button"
            onClick={() => {
              setGoalToEdit(null)
              setIsModalOpen(true)
            }}
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>Add Goal</span>
          </button>
        </div>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <section className="goal-grid" aria-label="Savings goals">
        {isLoading ? (
          <article className="dashboard-card">
            <p>Loading goals...</p>
          </article>
        ) : goals.length ? (
          filteredGoals.length ? (
            filteredGoals.map((goal) => {
          const percent = Math.min((goal.saved / goal.target) * 100, 100)

          return (
            <article className="dashboard-card" key={goal.id}>
              <div className="card-heading">
                <h2>{goal.name}</h2>
                <span>Due {goal.date}</span>
              </div>

              <strong className="goal-value">
                INR {goal.saved.toLocaleString('en-IN')}
              </strong>
              <p className="goal-target">
                of INR {goal.target.toLocaleString('en-IN')} saved
              </p>

              <div className="budget-meter" aria-hidden="true">
                <span style={{ width: `${percent}%` }}></span>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  onClick={() => {
                    setGoalToEdit(goal)
                    setIsModalOpen(true)
                  }}
                  aria-label={`Edit ${goal.name}`}
                >
                  <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteGoal(goal.id)}
                  aria-label={`Delete ${goal.name}`}
                >
                  <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
            </article>
          )
        })
          ) : (
            <article className="dashboard-card">
              <p>No goals match your search.</p>
            </article>
          )
        ) : (
          <article className="dashboard-card">
            <p>No goals yet. Add a savings target to track progress.</p>
          </article>
        )}
      </section>

      {isModalOpen && (
        <GoalModal
          goalToEdit={goalToEdit}
          onClose={handleCloseModal}
          onSaveGoal={handleSaveGoal}
        />
      )}
    </section>
  )
}

export default GoalsPage
