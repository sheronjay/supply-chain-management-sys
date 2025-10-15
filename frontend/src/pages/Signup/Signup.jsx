import { useState } from 'react'
import { signup } from '../../services/authService'
import './Signup.css'

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    city: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        city: formData.city,
      })

      if (response.success) {
        // Store auth data
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('userId', response.user.user_id)

        // Call success callback
        onSignupSuccess(response.user)
      } else {
        setError(response.message || 'Signup failed')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'An error occurred during signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1>Supply Chain Management</h1>
          <p>Create Customer Account</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="signup-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                disabled={loading}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                autoComplete="address-level2"
                disabled={loading}
              />
            </div>
          </div>

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                autoComplete="new-password"
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                disabled={loading}
                minLength="6"
              />
            </div>
          </div>

          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? (
              <>
                <svg className="signup-spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="signup-switch-btn"
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
