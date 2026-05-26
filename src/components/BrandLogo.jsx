function BrandLogo({ variant = 'dark' }) {
  const className = variant === 'light' ? 'brand brand-light' : 'brand'

  return (
    <div className={className}>
      <div className="brand-mark" aria-hidden="true">
        P
      </div>
      <span>PocketPilot</span>
    </div>
  )
}

export default BrandLogo
