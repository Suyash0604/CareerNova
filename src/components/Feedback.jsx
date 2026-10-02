import { Link } from 'react-router-dom'
import { Check, Inbox, Info } from 'lucide-react'

export function Alert({ type = 'info', children }) {
  const Icon = type === 'success' ? Check : Info
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon size={16} />
      <div>{children}</div>
    </div>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, message, actionLabel, actionTo, children }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon size={22} />
      </span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" />
      {label}
    </div>
  )
}

// Wraps a labelled form control and its validation message.
export function Field({ label, htmlFor, error, hint, required, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
