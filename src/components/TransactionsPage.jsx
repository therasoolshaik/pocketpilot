import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddTransactionModal from './AddTransactionModal'
import EmptyTransactionsState from './EmptyTransactionsState'
import TransactionList from './TransactionList'

function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const hasTransactions = transactions.length > 0

  function handleAddTransaction(transaction) {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions,
    ])
    setIsAddModalOpen(false)
  }

  return (
    <section className="transactions-page" aria-labelledby="transactions-title">
      <header className="module-header">
        <div>
          <p className="eyebrow">Money movement</p>
          <h1 id="transactions-title">Transactions</h1>
          <p>
            Review income, track expenses, and keep every rupee categorized for
            better budgeting.
          </p>
        </div>

        <button
          className="primary-action"
          type="button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>Add Transaction</span>
        </button>
      </header>

      {hasTransactions ? (
        <TransactionList transactions={transactions} />
      ) : (
        <EmptyTransactionsState
          onAddTransaction={() => setIsAddModalOpen(true)}
        />
      )}

      {isAddModalOpen && (
        <AddTransactionModal
          onAddTransaction={handleAddTransaction}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </section>
  )
}

export default TransactionsPage
