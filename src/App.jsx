import { useState } from 'react'
import Dashboard from './components/Dashboard'
import LoginForm from './components/LoginForm'
import ProductPanel from './components/ProductPanel'
import './App.css'

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('pocketpilotToken')
    const storedUser = localStorage.getItem('pocketpilotUser')

    return {
      token,
      user: storedUser ? JSON.parse(storedUser) : null
    }
  })

  function handleAuthSuccess({ user, token }) {
    localStorage.setItem('pocketpilotToken', token)
    localStorage.setItem('pocketpilotUser', JSON.stringify(user))
    setAuth({ user, token })
  }

  function handleLogout() {
    localStorage.removeItem('pocketpilotToken')
    localStorage.removeItem('pocketpilotUser')
    setAuth({ user: null, token: null })
  }

  if (auth.token) {
    return <Dashboard onLogout={handleLogout} token={auth.token} user={auth.user} />
  }

  return (
    <main className="login-page">
      <ProductPanel />
      <LoginForm onAuthSuccess={handleAuthSuccess} />
    </main>
  )
}

export default App
