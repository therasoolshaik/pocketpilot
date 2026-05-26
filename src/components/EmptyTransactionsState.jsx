import { ArrowDownToLine, Sparkles, WalletCards } from 'lucide-react'

function EmptyTransactionsState({ onAddTransaction }) {
  return (
    <section className="empty-transactions" aria-labelledby="empty-title">
      <div className="empty-illustration" aria-hidden="true">
        <div className="empty-orbit">
          <WalletCards size={34} strokeWidth={1.9} />
        </div>
        <span className="empty-pill income">+₹50,000</span>
        <span className="empty-pill expense">-₹250</span>
      </div>

      <div className="empty-copy">
        <p className="eyebrow">Your money map starts here</p>
        <h2 id="empty-title">Start tracking your money journey</h2>
        <p>
          Your first transaction unlocks spending insights, budget patterns, and
          a clearer view of where your money goes each month.
        </p>
      </div>

      <div className="empty-actions">
        <button className="primary-action" type="button" onClick={onAddTransaction}>
          <Sparkles size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>Add First Transaction</span>
        </button>

        <button className="secondary-action" type="button">
          <ArrowDownToLine size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>Import Transactions</span>
        </button>
      </div>
    </section>
  )
}

export default EmptyTransactionsState
