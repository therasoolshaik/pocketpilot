function ModuleEmptyState({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  icon: Icon,
  previewItems = [],
}) {
  return (
    <section className="empty-transactions" aria-labelledby={`${title}-title`}>
      <div className="empty-illustration" aria-hidden="true">
        <div className="empty-orbit">
          <Icon size={34} strokeWidth={1.9} />
        </div>
        {previewItems.map((item) => (
          <span className={`empty-pill ${item.tone}`} key={item.label}>
            {item.label}
          </span>
        ))}
      </div>

      <div className="empty-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${title}-title`}>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="empty-actions">
        <button className="primary-action" type="button">
          <span>{primaryAction}</span>
        </button>

        {secondaryAction && (
          <button className="secondary-action" type="button">
            <span>{secondaryAction}</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default ModuleEmptyState
