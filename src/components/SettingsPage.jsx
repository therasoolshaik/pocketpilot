import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import SettingModal from './SettingModal'
import {
  createSetting,
  deleteSetting,
  fetchSettings,
  updateSetting,
} from '../services/settingApi'

function SettingsPage({ token }) {
  const [settings, setSettings] = useState([])
  const [settingToEdit, setSettingToEdit] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadSettings() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const data = await fetchSettings(token)

        if (isActive) {
          setSettings(data)
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

    loadSettings()

    return () => {
      isActive = false
    }
  }, [token])

  async function handleSaveSetting(setting) {
    try {
      setErrorMessage('')
      const savedSetting = settingToEdit
        ? await updateSetting(token, setting)
        : await createSetting(token, setting)

      setSettings((currentSettings) => {
        const exists = currentSettings.some((item) => item.id === savedSetting.id)

        if (exists) {
          return currentSettings.map((item) =>
            item.id === savedSetting.id ? savedSetting : item,
          )
        }

        return [...currentSettings, savedSetting]
      })

      setSettingToEdit(null)
      setIsModalOpen(false)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  async function handleDeleteSetting(settingId) {
    try {
      setErrorMessage('')
      await deleteSetting(token, settingId)
      setSettings((currentSettings) =>
        currentSettings.filter((setting) => setting.id !== settingId),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function handleCloseModal() {
    setSettingToEdit(null)
    setIsModalOpen(false)
  }

  return (
    <section className="module-page" aria-labelledby="settings-title">
      <header className="module-header">
        <div>
          <p className="eyebrow">Workspace preferences</p>
          <h1 id="settings-title">Settings</h1>
          <p>
            Manage profile details, currency preferences, notifications, and app
            defaults.
          </p>
        </div>

        <button
          className="primary-action"
          type="button"
          onClick={() => {
            setSettingToEdit(null)
            setIsModalOpen(true)
          }}
        >
          <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>Add Setting</span>
        </button>
      </header>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <section className="settings-list" aria-label="Settings list">
        {isLoading ? (
          <article className="settings-row">
            <div>
              <strong>Loading settings...</strong>
              <span>Fetching your saved preferences.</span>
            </div>
          </article>
        ) : settings.length ? (
          settings.map((setting) => (
          <article className="settings-row" key={setting.id}>
            <div>
              <strong>{setting.label}</strong>
              <span>{setting.description}</span>
            </div>
            <div className="settings-value">
              <b>{setting.value}</b>
              <button
                type="button"
                onClick={() => {
                  setSettingToEdit(setting)
                  setIsModalOpen(true)
                }}
                aria-label={`Edit ${setting.label}`}
              >
                <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSetting(setting.id)}
                aria-label={`Delete ${setting.label}`}
              >
                <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))
        ) : (
          <article className="settings-row">
            <div>
              <strong>No settings yet</strong>
              <span>Add a setting to store a preference.</span>
            </div>
          </article>
        )}
      </section>

      {isModalOpen && (
        <SettingModal
          settingToEdit={settingToEdit}
          onClose={handleCloseModal}
          onSaveSetting={handleSaveSetting}
        />
      )}
    </section>
  )
}

export default SettingsPage
