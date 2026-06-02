import { useEffect, useState } from 'react'
import { FolderPlus, Search } from 'lucide-react'
import AddCategoryModal from './AddCategoryModal'
import CategoryList from './CategoryList'
import EmptyCategoriesState from './EmptyCategoriesState'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../services/categoryApi'

function CategoriesPage({ token }) {
  const [categories, setCategories] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const hasCategories = categories.length > 0
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredCategories = normalizedSearchQuery
    ? categories.filter((category) =>
        [
          category.name,
          category.type,
          category.icon,
          category.monthlyLimit,
          category.description,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearchQuery),
          ),
      )
    : categories

  useEffect(() => {
    let isActive = true

    async function loadCategories() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const data = await fetchCategories(token)

        if (isActive) {
          setCategories(data)
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

    loadCategories()

    return () => {
      isActive = false
    }
  }, [token])

  async function handleSaveCategory(category) {
    try {
      setErrorMessage('')
      const savedCategory = categoryToEdit
        ? await updateCategory(token, category)
        : await createCategory(token, category)

      setCategories((currentCategories) => {
        const exists = currentCategories.some((item) => item.id === savedCategory.id)

        if (exists) {
          return currentCategories.map((item) =>
            item.id === savedCategory.id ? savedCategory : item,
          )
        }

        return [...currentCategories, savedCategory].sort((first, second) =>
          first.name.localeCompare(second.name),
        )
      })

      setIsAddModalOpen(false)
      setCategoryToEdit(null)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleEditCategory(category) {
    setCategoryToEdit(category)
    setIsAddModalOpen(true)
  }

  async function handleDeleteCategory(categoryId) {
    try {
      setErrorMessage('')
      await deleteCategory(token, categoryId)
      setCategories((currentCategories) =>
        currentCategories.filter((category) => category.id !== categoryId),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleCloseModal() {
    setIsAddModalOpen(false)
    setCategoryToEdit(null)
  }

  return (
    <section className="categories-page" aria-labelledby="categories-title">
      <header className="module-header module-toolbar-header">
        <div>
          <p className="eyebrow">Spending structure</p>
          <h1 id="categories-title">Categories</h1>
          <p>
            Create clean money groups for transactions, budgets, and analytics.
          </p>
        </div>

        <div className="module-toolbar">
          <label
            className="module-search compact-search"
            htmlFor="categories-search"
            aria-label="Search categories"
          >
            <div className="search-input-wrap">
              <Search size={17} strokeWidth={2.2} aria-hidden="true" />
              <input
                id="categories-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search categories"
              />
            </div>
          </label>

          <button
            className="primary-action"
            type="button"
            onClick={() => {
              setCategoryToEdit(null)
              setIsAddModalOpen(true)
            }}
          >
            <FolderPlus size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>Add Category</span>
          </button>
        </div>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      {isLoading ? (
        <section className="categories-table-card" aria-label="Loading categories">
          <p>Loading categories...</p>
        </section>
      ) : hasCategories ? (
        filteredCategories.length ? (
          <CategoryList
            categories={filteredCategories}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
          />
        ) : (
          <section className="categories-table-card" aria-label="No matching categories">
            <p>No categories match your search.</p>
          </section>
        )
      ) : (
        <EmptyCategoriesState onAddCategory={() => setIsAddModalOpen(true)} />
      )}

      {isAddModalOpen && (
        <AddCategoryModal
          categoryToEdit={categoryToEdit}
          onSaveCategory={handleSaveCategory}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default CategoriesPage
