import { X } from 'lucide-react'

function SettingModal({ onClose, onSaveSetting, settingToEdit }) {
  const isEditing = Boolean(settingToEdit)

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    onSaveSetting({
      id: settingToEdit?.id ?? crypto.randomUUID(),
      label: formData.get('label').trim(),
      value: formData.get('value').trim(),
      description: formData.get('description').trim(),
    })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="setting-modal-title"
      >
        <header className="modal-header">
          <div>
            <p className="eyebrow">Preference</p>
            <h2 id="setting-modal-title">
              {isEditing ? settingToEdit.label : 'Add setting'}
            </h2>
          </div>

          <button className="icon-button" type="button" onClick={onClose}>
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <label htmlFor="setting-label">Label</label>
          <input
            id="setting-label"
            name="label"
            type="text"
            defaultValue={settingToEdit?.label ?? ''}
            placeholder="Default currency"
            required
          />

          <label htmlFor="setting-value">Value</label>
          <input
            id="setting-value"
            name="value"
            type="text"
            defaultValue={settingToEdit?.value ?? ''}
            placeholder="INR"
            required
          />

          <label htmlFor="setting-description">Description</label>
          <textarea
            id="setting-description"
            name="description"
            rows="3"
            defaultValue={settingToEdit?.description ?? ''}
          ></textarea>

          <div className="modal-actions">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-action" type="submit">
              {isEditing ? 'Save Setting' : 'Add Setting'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SettingModal
