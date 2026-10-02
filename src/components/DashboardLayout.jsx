import { NavLink } from 'react-router-dom'
import {
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  User,
  Users,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV = {
  student: [
    ['/student/dashboard', 'Dashboard', LayoutDashboard],
    ['/student/profile', 'Profile', User],
    ['/student/resume', 'Resume', FileText],
    ['/student/saved', 'Saved', Bookmark],
    ['/student/applications', 'Applications', ClipboardList],
    ['/notifications', 'Notifications', Bell],
  ],
  recruiter: [
    ['/recruiter/dashboard', 'Dashboard', LayoutDashboard],
    ['/recruiter/jobs', 'My Jobs', Briefcase],
    ['/recruiter/internships', 'My Internships', GraduationCap],
    ['/recruiter/applicants', 'Applicants', Users],
    ['/recruiter/company', 'Company Profile', Building2],
    ['/notifications', 'Notifications', Bell],
  ],
  admin: [
    ['/admin/dashboard', 'Dashboard', LayoutDashboard],
    ['/notifications', 'Notifications', Bell],
  ],
}

// Shell for every logged-in page: role navigation on the left (a scrollable
// strip on mobile) and the page content on the right.
export default function DashboardLayout({ title, subtitle, actions, children }) {
  const { currentUser } = useApp()
  const links = NAV[currentUser.role] || []

  return (
    <div className="container dash">
      <aside className="dash-side">
        <div className="dash-user">
          <p className="dash-user-name">{currentUser.name}</p>
          <p className="muted small">{currentUser.role[0].toUpperCase() + currentUser.role.slice(1)} account</p>
        </div>
        <nav className="dash-nav" aria-label="Dashboard">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="dash-main">
        <div className="dash-head">
          <div>
            <h1>{title}</h1>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          {actions && <div className="btn-row">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}

export function StatGrid({ stats }) {
  return (
    <div className="stat-grid">
      {stats.map(([label, value]) => (
        <div className="card stat" key={label}>
          <p className="stat-value">{value}</p>
          <p className="stat-label">{label}</p>
        </div>
      ))}
    </div>
  )
}

export function Section({ title, action, children }) {
  return (
    <section className="dash-section">
      <div className="section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
