import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Field } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { ROLES, dashboardPath, isEmail } from '../utils/auth'

const DEMO_ACCOUNTS = [
  { role: 'student', email: 'rahul@example.com', password: 'student123' },
  { role: 'recruiter', email: 'recruiter@example.com', password: 'recruiter123' },
  { role: 'admin', email: 'admin@example.com', password: 'admin123' },
]

export default function Login() {
  const { currentUser, login } = useApp()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ email: state?.email || '', password: '', role: state?.role || 'student' })
  const [error, setError] = useState('')

  // Return to the page that asked for login, unless it belongs to another role.
  const targetFor = (role) => {
    const from = state?.from
    const otherRoleArea = from && /^\/(student|recruiter|admin)\//.test(from) && !from.startsWith(`/${role}/`)
    return from && !otherRoleArea ? from : dashboardPath(role)
  }

  if (currentUser) return <Navigate to={targetFor(currentUser.role)} replace />

  const set = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    if (!isEmail(form.email) || !form.password) {
      setError('Enter your email and password.')
      return
    }
    const result = login(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(targetFor(form.role), { replace: true })
  }

  return (
    <div className="container auth-page">
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h1>Login</h1>
        <p className="muted">Sign in to apply, save opportunities and track your applications.</p>
        {state?.registered && <Alert type="success">Registration successful. Please log in.</Alert>}
        {state?.from && !error && !state?.registered && <Alert type="info">Please log in to continue.</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <Field label="Email" htmlFor="l-email" required>
          <input
            id="l-email"
            type="email"
            className="input"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
          />
        </Field>
        <Field label="Password" htmlFor="l-password" required>
          <input
            id="l-password"
            type="password"
            className="input"
            autoComplete="current-password"
            value={form.password}
            onChange={set('password')}
          />
        </Field>
        <Field label="Role" htmlFor="l-role" required>
          <select id="l-role" className="input" value={form.role} onChange={set('role')}>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </Field>
        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
        <p className="auth-switch">
          New to CareerNova? <Link to="/register">Create an account</Link>
        </p>

        <div className="demo-box">
          <p className="small">
            <strong>Demo accounts</strong> — this is a frontend demonstration, so sign-in is checked in your browser
            only.
          </p>
          <ul>
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.role}>
                <span>
                  {account.email} / {account.password}
                </span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setForm(account)
                    setError('')
                  }}
                >
                  Use {account.role}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  )
}
