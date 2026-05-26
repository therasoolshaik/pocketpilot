import { Pencil, Trash2 } from 'lucide-react'

function formatAmount(transaction) {
  const prefix = transaction.type === 'income' ? '+' : '-'
  return `${prefix}₹${Number(transaction.amount).toLocaleString('en-IN')}`
}

function TransactionList({ transactions }) {
  return (
    <section className="transactions-table-card" aria-label="Transactions list">
      <div className="transactions-table-header">
        <span>Transaction</span>
        <span>Category</span>
        <span>Date</span>
        <span>Method</span>
        <span>Amount</span>
        <span>Actions</span>
      </div>

      <div className="transactions-table-body">
        {transactions.map((transaction) => (
          <article className="transaction-item" key={transaction.id}>
            <div className="transaction-main">
              <strong>{transaction.title}</strong>
              {transaction.notes && <span>{transaction.notes}</span>}
            </div>

            <span>{transaction.category}</span>
            <span>{transaction.date}</span>
            <span>{transaction.paymentMethod || 'Not set'}</span>

            <strong
              className={
                transaction.type === 'income' ? 'amount income' : 'amount expense'
              }
            >
              {formatAmount(transaction)}
            </strong>

            <div className="table-actions">
              <button type="button" aria-label={`Edit ${transaction.title}`}>
                <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Delete ${transaction.title}`}>
                <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TransactionList
