import BrandLogo from './BrandLogo'

function ProductPanel() {
  return (
    <section className="product-panel" aria-label="PocketPilot overview">
      <BrandLogo variant="light" />

      <div className="product-copy">
        <p className="eyebrow">Smarter money routines</p>
        <h2>See your cash flow before it surprises you.</h2>
        <p>
          Connect accounts, monitor spending patterns, and keep every budget
          decision grounded in real numbers.
        </p>
      </div>

      <div className="finance-card" aria-hidden="true">
        <div className="finance-card-header">
          <span>Monthly balance</span>
          <strong>$8,420.50</strong>
        </div>

        <div className="balance-chart">
          <span style={{ height: '42%' }}></span>
          <span style={{ height: '58%' }}></span>
          <span style={{ height: '48%' }}></span>
          <span style={{ height: '72%' }}></span>
          <span style={{ height: '64%' }}></span>
          <span style={{ height: '86%' }}></span>
        </div>

        <div className="finance-row">
          <span>Budget health</span>
          <strong>On track</strong>
        </div>
        <div className="finance-row">
          <span>Savings goal</span>
          <strong>74%</strong>
        </div>
      </div>
    </section>
  )
}

export default ProductPanel
