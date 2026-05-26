import { useState } from 'react'
import BrandLogo from './BrandLogo'

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateForm() {
    const nextErrors = {}
    const trimmedEmail = email.trim()

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

    await new Promise((resolve) => {
      setTimeout(resolve, 1200)
    })

    console.log({
      email: email.trim(),
      passwordLength: password.length,
      rememberMe,
    })

    setIsSubmitting(false)
    onLoginSuccess()
  }

  return (
    <section className="login-panel" aria-labelledby="login-title">
      <BrandLogo />

      <div className="login-copy">
        <p className="eyebrow">Personal finance dashboard</p>
        <h1 id="login-title">Welcome back</h1>
        <p>Sign in to review spending, budgets, and your next money moves.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
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
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="divider">
        <span>or continue with</span>
      </div>

      <button className="social-button" type="button">
        Google
      </button>

      <p className="signup-prompt">
        New to PocketPilot? <a href="#create-account">Create an account</a>
      </p>
    </section>
  )
}

export default LoginForm
