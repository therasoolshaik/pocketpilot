import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import AddTransactionModal from './AddTransactionModal'
import EmptyTransactionsState from './EmptyTransactionsState'
import TransactionList from './TransactionList'
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '../services/transactionApi'
import { fetchCategories } from '../services/categoryApi'

function TransactionsPage({ token }) {
  const [transactions, setTransactions] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const hasTransactions = transactions.length > 0
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredTransactions = normalizedSearchQuery
    ? transactions.filter((transaction) =>
        [
          transaction.title,
          transaction.type,
          transaction.amount,
          transaction.category,
          transaction.date,
          transaction.paymentMethod,
          transaction.notes,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearchQuery),
          ),
      )
    : transactions

  useEffect(() => {
    let isActive = true

    async function loadTransactions() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const [transactionData, categoryData] = await Promise.all([
          fetchTransactions(token),
          fetchCategories(token),
        ])

        if (isActive) {
          setTransactions(transactionData)
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

    loadTransactions()

    return () => {
      isActive = false
    }
  }, [token])

  async function handleSaveTransaction(transaction) {
    try {
      setErrorMessage('')
      const savedTransaction = transactionToEdit
        ? await updateTransaction(token, transaction)
        : await createTransaction(token, transaction)

      setTransactions((currentTransactions) => {
        const exists = currentTransactions.some((item) => item.id === savedTransaction.id)

        if (exists) {
          return currentTransactions.map((item) =>
            item.id === savedTransaction.id ? savedTransaction : item,
          )
        }

        return [savedTransaction, ...currentTransactions]
      })

      setIsAddModalOpen(false)
      setTransactionToEdit(null)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleEditTransaction(transaction) {
    setTransactionToEdit(transaction)
    setIsAddModalOpen(true)
  }

  async function handleDeleteTransaction(transactionId) {
    try {
      setErrorMessage('')
      await deleteTransaction(token, transactionId)
      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction.id !== transactionId),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleCloseModal() {
    setIsAddModalOpen(false)
    setTransactionToEdit(null)
  }

  return (
    <section className="transactions-page" aria-labelledby="transactions-title">
      <header className="module-header module-toolbar-header">
        <div>
          <p className="eyebrow">Money movement</p>
          <h1 id="transactions-title">Transactions</h1>
          <p>
            Review income, track expenses, and keep every rupee categorized for
            better budgeting.
          </p>
        </div>

        <div className="module-toolbar">
          <label
            className="module-search compact-search"
            htmlFor="transactions-search"
            aria-label="Search transactions"
          >
            <div className="search-input-wrap">
              <Search size={17} strokeWidth={2.2} aria-hidden="true" />
              <input
                id="transactions-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search transactions"
              />
            </div>
          </label>

          <button
            className="primary-action"
            type="button"
            onClick={() => {
              setTransactionToEdit(null)
              setIsAddModalOpen(true)
            }}
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>Add Transaction</span>
          </button>
        </div>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      {isLoading ? (
        <section className="transactions-table-card" aria-label="Loading transactions">
          <p>Loading transactions...</p>
        </section>
      ) : hasTransactions ? (
        filteredTransactions.length ? (
          <TransactionList
            transactions={filteredTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
          />
        ) : (
          <section className="transactions-table-card" aria-label="No matching transactions">
            <p>No transactions match your search.</p>
          </section>
        )
      ) : (
        <EmptyTransactionsState
          onAddTransaction={() => setIsAddModalOpen(true)}
        />
      )}

      {isAddModalOpen && (
        <AddTransactionModal
          categories={categories}
          transactionToEdit={transactionToEdit}
          onSaveTransaction={handleSaveTransaction}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default TransactionsPage
