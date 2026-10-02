import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'
import { useApp } from '../context/AppContext'
import { dashboardPath } from '../utils/auth'

const LINKS = [
  ['/', 'Home'],
  ['/jobs', 'Jobs'],
  ['/internships', 'Internships'],
  ['/placements', 'Placements'],
  ['/companies', 'Companies'],
  ['/about', 'About'],
]

const PROFILE_PATH = { student: '/student/profile', recruiter: '/recruiter/company' }

export default function Navbar() {
  const { currentUser } = useApp()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="navbar">
      <div className={`container nav-inner ${open ? 'open' : ''}`}>
        <Link to="/" className="brand">
          <span className="brand-mark">CN</span>
          <span>
            <span className="brand-name">CareerNova</span>
            <span className="brand-tag">Careers. Opportunities. Growth.</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-right">
          {currentUser && <NotificationDropdown />}
          <button
            type="button"
            className="icon-btn nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="nav-actions">
          {currentUser ? (
            <>
              {PROFILE_PATH[currentUser.role] && (
                <Link to={PROFILE_PATH[currentUser.role]} className="btn btn-ghost btn-sm">
                  <User size={15} /> Profile
                </Link>
              )}
              <Link to={dashboardPath(currentUser.role)} className="btn btn-outline btn-sm">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/logout" className="btn btn-ghost btn-sm">
                <LogOut size={15} /> Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
