import { Link } from 'react-router-dom'
import { Briefcase, Building2, CalendarDays, GraduationCap } from 'lucide-react'
import Hero from '../components/Hero'
import JobCard from '../components/JobCard'
import InternshipCard from '../components/InternshipCard'
import PlacementCard from '../components/PlacementCard'
import { useApp } from '../context/AppContext'

const FEATURED = 4

const STEPS = [
  ['Create your profile', 'Register as a student and add your college, degree, branch and skills.'],
  ['Upload your resume', 'Add your resume once and use it for every application.'],
  ['Find opportunities', 'Search and filter jobs, internships and placement drives.'],
  ['Apply and track applications', 'Apply in a few clicks and follow the status from your dashboard.'],
]

function HomeSection({ title, to, linkLabel, children, tinted = false }) {
  return (
    <section className={`section ${tinted ? 'section-tinted' : ''}`}>
      <div className="container">
        <div className="section-head">
          <h2>{title}</h2>
          <Link to={to}>{linkLabel}</Link>
        </div>
        <div className="grid grid-2">{children}</div>
      </div>
    </section>
  )
}

export default function Home() {
  const { jobs, internships, placements, companies } = useApp()

  const categories = [
    ['/jobs', 'Jobs', jobs.length, 'open positions', Briefcase],
    ['/internships', 'Internships', internships.length, 'internships', GraduationCap],
    ['/placements', 'Placement Drives', placements.length, 'drives', CalendarDays],
    ['/companies', 'Companies', companies.length, 'companies', Building2],
  ]

  return (
    <>
      <Hero />

      <section className="section section-tight">
        <div className="container grid grid-4">
          {categories.map(([to, label, count, unit, Icon]) => (
            <Link key={to} to={to} className="card category">
              <span className="category-icon">
                <Icon size={20} />
              </span>
              <span>
                <span className="category-name">{label}</span>
                <span className="muted small">
                  {count} {unit}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <HomeSection title="Featured Jobs" to="/jobs" linkLabel="View all jobs">
        {jobs.slice(0, FEATURED).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </HomeSection>

      <HomeSection title="Featured Internships" to="/internships" linkLabel="View all internships" tinted>
        {internships.slice(0, FEATURED).map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </HomeSection>

      <HomeSection title="Placement Drives" to="/placements" linkLabel="View all drives">
        {placements.slice(0, FEATURED).map((drive) => (
          <PlacementCard key={drive.id} drive={drive} />
        ))}
      </HomeSection>

      <section className="section section-tinted">
        <div className="container">
          <div className="section-head">
            <h2>How CareerNova Works</h2>
          </div>
          <ol className="steps">
            {STEPS.map(([title, text], index) => (
              <li key={title} className="card step">
                <span className="step-num">{index + 1}</span>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Ready to take the next step in your career?</h2>
            <p>Browse current openings and apply with your saved resume.</p>
          </div>
          <div className="btn-row">
            <Link to="/jobs" className="btn btn-primary">
              Explore Jobs
            </Link>
            <Link to="/internships" className="btn btn-light">
              Explore Internships
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
