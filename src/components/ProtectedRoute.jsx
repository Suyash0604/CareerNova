import { Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { dashboardPath } from '../utils/auth'
import { EmptyState } from './Feedback'

// Frontend-only guard: checks the role stored in currentUser.
export default function ProtectedRoute({ roles, children }) {
  const { currentUser } = useApp()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  if (roles && !roles.includes(currentUser.role)) {
    return (
      <div className="container section">
        <EmptyState
          icon={ShieldAlert}
          title="You don't have access to this page"
          message={`This page is not available for ${currentUser.role} accounts.`}
          actionLabel="Go to my dashboard"
          actionTo={dashboardPath(currentUser.role)}
        />
      </div>
    )
  }
  return children
}
