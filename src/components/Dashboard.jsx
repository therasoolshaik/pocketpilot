import { useState } from 'react'
import Sidebar from './Sidebar'
import TransactionsPage from './TransactionsPage'

const summaryCards = [
  {
    label: 'Total balance',
    value: '$8,420.50',
    meta: '+12.5% from last month',
  },
  {
    label: 'Monthly spending',
    value: '$2,184.30',
    meta: '$316 below budget',
  },
  {
    label: 'Savings goal',
    value: '74%',
    meta: '$3,700 of $5,000 saved',
  },
]

const transactions = [
  {
    name: 'Grocery Market',
    category: 'Food',
    amount: '-$84.20',
  },
  {
    name: 'Salary Deposit',
    category: 'Income',
    amount: '+$4,850.00',
  },
  {
    name: 'Metro Card',
    category: 'Transport',
    amount: '-$32.00',
  },
]

function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <main className="app-shell">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />

      <div className="dashboard-page">
        {activeSection === 'transactions' ? (
          <TransactionsPage />
        ) : (
          <>
            <section className="dashboard-hero" aria-labelledby="dashboard-title">
              <div>
                <p className="eyebrow">Today overview</p>
                <h1 id="dashboard-title">Your money is on track.</h1>
                <p>
                  Spending is trending below budget, and your savings goal is
                  moving ahead steadily.
                </p>
              </div>
            </section>

            <section className="summary-grid" aria-label="Account summary">
              {summaryCards.map((card) => (
                <article className="summary-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.meta}</p>
                </article>
              ))}
            </section>

            <section className="dashboard-grid">
              <article className="dashboard-card">
                <div className="card-heading">
                  <h2>Budget health</h2>
                  <span>May</span>
                </div>

                <div className="budget-meter" aria-hidden="true">
                  <span></span>
                </div>

                <div className="budget-details">
                  <span>Spent $2,184</span>
                  <strong>$316 remaining</strong>
                </div>
              </article>

              <article className="dashboard-card">
                <div className="card-heading">
                  <h2>Recent transactions</h2>
                  <span>Latest</span>
                </div>

                <div className="transaction-list">
                  {transactions.map((transaction) => (
                    <div className="transaction-row" key={transaction.name}>
                      <div>
                        <strong>{transaction.name}</strong>
                        <span>{transaction.category}</span>
                      </div>
                      <b>{transaction.amount}</b>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default Dashboard
