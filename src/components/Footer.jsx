import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      ['/', 'Home'],
      ['/jobs', 'Jobs'],
      ['/internships', 'Internships'],
      ['/placements', 'Placements'],
      ['/companies', 'Companies'],
      ['/about', 'About'],
    ],
  },
  {
    title: 'For Students',
    links: [
      ['/student/dashboard', 'Dashboard'],
      ['/student/applications', 'Applications'],
      ['/student/saved', 'Saved Jobs'],
      ['/student/resume', 'Resume'],
    ],
  },
  {
    title: 'For Recruiters',
    links: [
      ['/recruiter/dashboard', 'Recruiter Dashboard'],
      ['/recruiter/jobs/new', 'Post Job'],
      ['/recruiter/internships/new', 'Post Internship'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">CareerNova</p>
          <p className="footer-text">
            A career portal that brings jobs, internships and campus placement drives together for students and
            recruiters.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li>
              <MapPin size={15} /> Career Cell, Shivajinagar, Pune 411005
            </li>
            <li>
              <Mail size={15} /> support@careernova.example
            </li>
            <li>
              <Phone size={15} /> +91 20 5550 0142
            </li>
            <li>
              <Link to="/contact">Send us a message</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} CareerNova. Demonstration project — all data is stored in your browser.</span>
      </div>
    </footer>
  )
}
