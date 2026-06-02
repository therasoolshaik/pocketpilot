function TransactionForm({ onAddTransaction }) {
  function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const transaction = {
      id: crypto.randomUUID(),
      type: formData.get('type'),
      title: formData.get('title').trim(),
      amount: formData.get('amount'),
      category: formData.get('category'),
      date: formData.get('date'),
      paymentMethod: formData.get('paymentMethod'),
      notes: formData.get('notes').trim(),
    }

    onAddTransaction(transaction)
    form.reset()
  }

  return (
    <section className="transaction-form-card" aria-labelledby="form-title">
      <div className="card-heading">
        <div>
          <h2 id="form-title">Add transaction</h2>
          <span>Capture income and expenses as they happen.</span>
        </div>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <fieldset className="type-selector">
          <legend>Transaction Type</legend>
          <label>
            <input name="type" type="radio" value="income" defaultChecked />
            <span>Income</span>
          </label>
          <label>
            <input name="type" type="radio" value="expense" />
            <span>Expense</span>
          </label>
        </fieldset>

        <label htmlFor="transaction-title">Title</label>
        <input
          id="transaction-title"
          name="title"
          type="text"
          placeholder="Salary, Food, Netflix"
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
              required
            />
          </div>

          <div>
            <label htmlFor="transaction-date">Date</label>
            <input id="transaction-date" name="date" type="date" required />
          </div>
        </div>

        <label htmlFor="transaction-category">Category</label>
        <select id="transaction-category" name="category" required>
          <option value="">Select category</option>
          <option value="Income">Income</option>
          <option value="Food">Food</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
        </select>

        <label htmlFor="payment-method">Payment Method</label>
        <select id="payment-method" name="paymentMethod">
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
        ></textarea>

        <button className="primary-action" type="submit">
          Add to Transactions
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
