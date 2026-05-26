import { useState } from 'react'
import Dashboard from './components/Dashboard'
import LoginForm from './components/LoginForm'
import ProductPanel from './components/ProductPanel'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <main className="login-page">
      <ProductPanel />
      <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
    </main>
  )
}

export default App
