import {
  BarChart3,
  CircleDollarSign,
  Flag,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Tags,
  WalletCards,
} from 'lucide-react'
import BrandLogo from './BrandLogo'

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ListOrdered,
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: Tags,
  },
  {
    id: 'budgets',
    label: 'Budgets',
    icon: WalletCards,
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Flag,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
]

function Sidebar({ activeSection, onSectionChange, onLogout }) {
  return (
    <aside className="app-sidebar" aria-label="Primary navigation">
      <BrandLogo />

      <nav className="sidebar-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              className={isActive ? 'sidebar-link active' : 'sidebar-link'}
              type="button"
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="plan-card">
          <CircleDollarSign size={20} strokeWidth={2} aria-hidden="true" />
          <div>
            <strong>Cash flow</strong>
            <span>Healthy this month</span>
          </div>
        </div>

        <button className="logout-button" type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
