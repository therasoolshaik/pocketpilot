import { FolderPlus, Tags } from 'lucide-react'

function EmptyCategoriesState({ onAddCategory }) {
  return (
    <section className="empty-transactions" aria-labelledby="empty-categories-title">
      <div className="empty-illustration" aria-hidden="true">
        <div className="empty-orbit">
          <Tags size={34} strokeWidth={1.9} />
        </div>
        <span className="empty-pill income">Food</span>
        <span className="empty-pill expense">Bills</span>
      </div>

      <div className="empty-copy">
        <p className="eyebrow">Organize spending</p>
        <h2 id="empty-categories-title">Create your first category</h2>
        <p>
          Categories help PocketPilot group transactions, power budgets, and
          reveal where your money is really going.
        </p>
      </div>

      <div className="empty-actions">
        <button className="primary-action" type="button" onClick={onAddCategory}>
          <FolderPlus size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>Add First Category</span>
        </button>
      </div>
    </section>
  )
}

export default EmptyCategoriesState
