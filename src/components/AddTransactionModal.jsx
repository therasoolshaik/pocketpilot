import { useState } from 'react'
import { X } from 'lucide-react'

function AddTransactionModal({
  categories = [],
  transactionToEdit,
  onSaveTransaction,
  onClose,
}) {
  const isEditing = Boolean(transactionToEdit)
  const [selectedType, setSelectedType] = useState(
    transactionToEdit?.type ?? 'expense',
  )
  const filteredCategories = categories.filter(
    (category) => category.type === selectedType,
  )

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const transaction = {
      id: transactionToEdit?.id ?? crypto.randomUUID(),
      type: formData.get('type'),
      title: formData.get('title').trim(),
      amount: formData.get('amount'),
      category: formData.get('category'),
      date: formData.get('date'),
      paymentMethod: formData.get('paymentMethod'),
      notes: formData.get('notes').trim(),
    }

    onSaveTransaction(transaction)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-transaction-title"
      >
        <header className="modal-header">
          <div>
            <p className="eyebrow">Money movement</p>
            <h2 id="add-transaction-title">
              {isEditing ? 'Edit transaction' : 'Add transaction'}
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
            <legend>Transaction Type</legend>
            <label>
              <input
                name="type"
                type="radio"
                value="income"
                checked={selectedType === 'income'}
                onChange={() => setSelectedType('income')}
              />
              <span>Income</span>
            </label>
            <label>
              <input
                name="type"
                type="radio"
                value="expense"
                checked={selectedType === 'expense'}
                onChange={() => setSelectedType('expense')}
              />
              <span>Expense</span>
            </label>
          </fieldset>

          <label htmlFor="transaction-title">Title</label>
          <input
            id="transaction-title"
            name="title"
            type="text"
            placeholder="Salary, Food, Netflix"
            defaultValue={transactionToEdit?.title ?? ''}
            required
          />

          <div className="form-grid">
            <div>
              <label htmlFor="transaction-amount">Amount</label>
              <input
                id="transaction-amount"
                name="amount"
                type="number"
                min="0"
                placeholder="50000"
                defaultValue={transactionToEdit?.amount ?? ''}
                required
              />
            </div>

            <div>
              <label htmlFor="transaction-date">Date</label>
              <input
                id="transaction-date"
                name="date"
                type="date"
                defaultValue={transactionToEdit?.date ?? ''}
                required
              />
            </div>
          </div>

          <label htmlFor="transaction-category">Category</label>
          <select
            id="transaction-category"
            name="category"
            defaultValue={transactionToEdit?.category ?? ''}
            required
          >
            <option value="">Select category</option>
            {!filteredCategories.length && (
              <option value="" disabled>
                No {selectedType} categories yet
              </option>
            )}
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="payment-method">Payment Method</label>
          <select
            id="payment-method"
            name="paymentMethod"
            defaultValue={transactionToEdit?.paymentMethod ?? ''}
          >
            <option value="">Select method</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank transfer">Bank transfer</option>
          </select>

          <label htmlFor="transaction-notes">Notes</label>
          <textarea
            id="transaction-notes"
            name="notes"
            rows="3"
            placeholder="Optional details"
            defaultValue={transactionToEdit?.notes ?? ''}
          ></textarea>

          <div className="modal-actions">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              {isEditing ? 'Save Changes' : 'Submit Transaction'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddTransactionModal
