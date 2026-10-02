import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Logging out through a public route means no protected page is on screen
// when currentUser is removed, so the visitor always lands on Home.
export default function Logout() {
  const { logout } = useApp()
  useEffect(() => {
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Navigate to="/" replace />
}
