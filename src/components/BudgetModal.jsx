import { X } from 'lucide-react'

function getCurrentPeriod() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  return `${now.getFullYear()}-${month}`
}

function BudgetModal({ budgetToEdit, categories = [], onClose, onSaveBudget }) {
  const isEditing = Boolean(budgetToEdit)
  const expenseCategories = categories.filter(
    (category) => category.type === 'expense',
  )

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const budget = {
      id: budgetToEdit?.id ?? crypto.randomUUID(),
      category: formData.get('category'),
      limit: Number(formData.get('limit')),
      period: formData.get('period'),
    }

    onSaveBudget(budget)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-modal-title"
      >
        <header className="modal-header">
          <div>
            <p className="eyebrow">Budget planning</p>
            <h2 id="budget-modal-title">
              {isEditing ? 'Edit budget' : 'Create budget'}
            </h2>
          </div>

          <button className="icon-button" type="button" onClick={onClose}>
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <label htmlFor="budget-category">Category</label>
          <select
            id="budget-category"
            name="category"
            defaultValue={budgetToEdit?.category ?? ''}
            required
          >
            <option value="">Select expense category</option>
            {!expenseCategories.length && (
              <option value="" disabled>
                No expense categories yet
              </option>
            )}
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="budget-limit">Limit</label>
          <input
            id="budget-limit"
            name="limit"
            type="number"
            min="0"
            defaultValue={budgetToEdit?.limit ?? ''}
            required
          />

          <label htmlFor="budget-period">Period</label>
          <input
            id="budget-period"
            name="period"
            type="month"
            defaultValue={budgetToEdit?.period ?? getCurrentPeriod()}
            required
          />

          <div className="modal-actions">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              {isEditing ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default BudgetModal
