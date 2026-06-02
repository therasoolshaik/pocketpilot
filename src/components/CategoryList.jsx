import { Pencil, Trash2 } from 'lucide-react'

function CategoryList({ categories, onDeleteCategory, onEditCategory }) {
  return (
    <section className="categories-table-card" aria-label="Categories list">
      <div className="categories-table-header">
        <span>Category</span>
        <span>Type</span>
        <span>Monthly limit</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div className="categories-table-body">
        {categories.map((category) => (
          <article className="category-item" key={category.id}>
            <div className="category-main">
              <span
                className="category-swatch"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              ></span>
              <div>
                <strong>{category.name}</strong>
                <span>{category.icon}</span>
              </div>
            </div>

            <span className={`category-badge ${category.type}`}>
              {category.type}
            </span>
            <span>
              {category.monthlyLimit
                ? `INR ${Number(category.monthlyLimit).toLocaleString('en-IN')}`
                : 'Not set'}
            </span>
            <span>{category.description || 'No description'}</span>

            <div className="table-actions">
              <button
                type="button"
                onClick={() => onEditCategory(category)}
                aria-label={`Edit ${category.name}`}
              >
                <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteCategory(category.id)}
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CategoryList
