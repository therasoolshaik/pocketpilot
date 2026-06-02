import { useState } from 'react'
import BrandLogo from './BrandLogo'
import { loginUser, signupUser } from '../services/authApi'

function LoginForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  function validateForm() {
    const nextErrors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (isSignup && !trimmedName) {
      nextErrors.name = 'Please enter your name.'
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!trimmedEmail.includes('@')) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.'
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const authResponse = isSignup
        ? await signupUser({ name: name.trim(), email: email.trim(), password })
        : await loginUser({ email: email.trim(), password })

      onAuthSuccess(authResponse)
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  function toggleMode(nextMode) {
    setMode(nextMode)
    setErrors({})
  }

  return (
    <section className="login-panel" aria-labelledby="login-title">
      <BrandLogo />

      <div className="login-copy">
        <p className="eyebrow">Personal finance dashboard</p>
        <h1 id="login-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p>
          {isSignup
            ? 'Start tracking spending, budgets, and your next money moves.'
            : 'Sign in to review spending, budgets, and your next money moves.'}
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {errors.form && <p className="form-error">{errors.form}</p>}

        {isSignup && (
          <>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p className="field-error" id="name-error">
                {errors.name}
              </p>
            )}
          </>
        )}

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p className="field-error" id="email-error">
            {errors.email}
          </p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p className="field-error" id="password-error">
            {errors.password}
          </p>
        )}

        <div className="form-options">
          <label className="checkbox-label" htmlFor="remember">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <a href="#forgot-password">Forgot password?</a>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <div className="divider">
        <span>or continue with</span>
      </div>

      <button className="social-button" type="button">
        Google
      </button>

      <p className="signup-prompt">
        {isSignup ? 'Already have an account?' : 'New to PocketPilot?'}{' '}
        <button
          className="link-button"
          type="button"
          onClick={() => toggleMode(isSignup ? 'login' : 'signup')}
        >
          {isSignup ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </section>
  )
}

export default LoginForm
