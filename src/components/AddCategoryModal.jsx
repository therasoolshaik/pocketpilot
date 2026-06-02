import { X } from 'lucide-react'

function AddCategoryModal({ categoryToEdit, onSaveCategory, onClose }) {
  const isEditing = Boolean(categoryToEdit)

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const category = {
      id: categoryToEdit?.id ?? crypto.randomUUID(),
      name: formData.get('name').trim(),
      type: formData.get('type'),
      icon: formData.get('icon').trim(),
      color: formData.get('color'),
      monthlyLimit: formData.get('monthlyLimit'),
      description: formData.get('description').trim(),
    }

    onSaveCategory(category)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-category-title"
      >
        <header className="modal-header">
          <div>
            <p className="eyebrow">Category setup</p>
            <h2 id="add-category-title">
              {isEditing ? 'Edit category' : 'Add category'}
            </h2>
          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <fieldset className="type-selector">
            <legend>Category Type</legend>
            <label>
              <input
                name="type"
                type="radio"
                value="expense"
                defaultChecked={categoryToEdit?.type !== 'income'}
              />
              <span>Expense</span>
            </label>
            <label>
              <input
                name="type"
                type="radio"
                value="income"
                defaultChecked={categoryToEdit?.type === 'income'}
              />
              <span>Income</span>
            </label>
          </fieldset>

          <label htmlFor="category-name">Category name</label>
          <input
            id="category-name"
            name="name"
            type="text"
            placeholder="Food, Salary, Rent"
            defaultValue={categoryToEdit?.name ?? ''}
            required
          />

          <div className="form-grid">
            <div>
              <label htmlFor="category-icon">Icon label</label>
              <input
                id="category-icon"
                name="icon"
                type="text"
                placeholder="Dining, Work, Home"
                defaultValue={categoryToEdit?.icon ?? ''}
                required
              />
            </div>

            <div>
              <label htmlFor="category-color">Color</label>
              <input
                id="category-color"
                name="color"
                type="color"
                defaultValue={categoryToEdit?.color ?? '#0f766e'}
              />
            </div>
          </div>

          <label htmlFor="monthly-limit">Monthly limit</label>
          <input
            id="monthly-limit"
            name="monthlyLimit"
            type="number"
            min="0"
            placeholder="10000"
            defaultValue={categoryToEdit?.monthlyLimit ?? ''}
          />

          <label htmlFor="category-description">Description</label>
          <textarea
            id="category-description"
            name="description"
            rows="3"
            placeholder="What should be grouped under this category?"
            defaultValue={categoryToEdit?.description ?? ''}
          ></textarea>

          <div className="modal-actions">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              {isEditing ? 'Save Changes' : 'Save Category'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddCategoryModal
