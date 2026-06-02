import { X } from 'lucide-react'

function GoalModal({ goalToEdit, onClose, onSaveGoal }) {
  const isEditing = Boolean(goalToEdit)

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const goal = {
      id: goalToEdit?.id ?? crypto.randomUUID(),
      name: formData.get('name').trim(),
      target: Number(formData.get('target')),
      saved: Number(formData.get('saved')),
      date: formData.get('date'),
    }

    onSaveGoal(goal)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
      >
        <header className="modal-header">
          <div>
            <p className="eyebrow">Savings target</p>
            <h2 id="goal-modal-title">{isEditing ? 'Edit goal' : 'Add goal'}</h2>
          </div>

          <button className="icon-button" type="button" onClick={onClose}>
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <label htmlFor="goal-name">Goal name</label>
          <input
            id="goal-name"
            name="name"
            type="text"
            placeholder="Emergency fund"
            defaultValue={goalToEdit?.name ?? ''}
            required
          />

          <div className="form-grid">
            <div>
              <label htmlFor="goal-target">Target</label>
              <input
                id="goal-target"
                name="target"
                type="number"
                min="0"
                defaultValue={goalToEdit?.target ?? ''}
                required
              />
            </div>
            <div>
              <label htmlFor="goal-saved">Saved</label>
              <input
                id="goal-saved"
                name="saved"
                type="number"
                min="0"
                defaultValue={goalToEdit?.saved ?? ''}
                required
              />
            </div>
          </div>

          <label htmlFor="goal-date">Due date</label>
          <input
            id="goal-date"
            name="date"
            type="date"
            defaultValue={goalToEdit?.date ?? ''}
            required
          />

          <div className="modal-actions">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              {isEditing ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default GoalModal
