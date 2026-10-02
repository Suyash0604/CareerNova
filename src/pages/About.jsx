import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=70'

const FEATURES = [
  'Job, internship and placement drive listings in one place',
  'Search with filters for location, type, experience and pay',
  'One resume upload used across all applications',
  'Application tracking with clear status updates',
  'Saved lists for opportunities you want to revisit',
  'Notifications when an application status changes',
]

const STUDENT_BENEFITS = [
  'See campus drives, off-campus jobs and internships without checking several notice boards and groups.',
  'Know where each application stands instead of waiting for an email.',
  'Keep your profile and resume ready so applying takes a minute.',
]

const RECRUITER_BENEFITS = [
  'Post jobs and internships and edit them at any time.',
  'View applicants for each posting with their resume and profile details.',
  'Move applicants through review, shortlist, interview and selection.',
]

function BulletCard({ title, items }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <ul className="detail-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default function About() {
  return (
    <>
      <PageHeader title="About CareerNova" subtitle="A career portal built around how students actually look for work." />
      <div className="container section section-tight">
        <div className="about-intro">
          <div className="prose">
            <h2>What CareerNova is</h2>
            <p>
              CareerNova is a jobs, internships and placement portal for college students. It lists openings from
              companies, lets students apply with a saved resume, and gives recruiters a simple way to review
              applicants.
            </p>
            <h2>Who it is for</h2>
            <p>
              Students and recent graduates looking for their first roles, recruiters hiring at the entry level, and
              placement cell staff who need an overview of activity on the portal.
            </p>
            <h2>The problem it solves</h2>
            <p>
              Placement information is usually scattered across emails, notice boards and messaging groups. Students
              miss deadlines and lose track of what they applied to. CareerNova keeps listings, deadlines and
              application status in one place.
            </p>
          </div>
          <img
            src={ABOUT_IMAGE}
            alt="University campus building"
            className="about-image"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div className="grid grid-3 about-cards">
          <BulletCard title="Main features" items={FEATURES} />
          <BulletCard title="For students" items={STUDENT_BENEFITS} />
          <BulletCard title="For recruiters" items={RECRUITER_BENEFITS} />
        </div>

        <div className="card note-card">
          <p>
            <strong>About this version.</strong> CareerNova currently runs entirely in the browser as a demonstration.
            Accounts, applications and resumes are stored on your own device and are not sent to any server.
          </p>
          <div className="btn-row">
            <Link to="/register" className="btn btn-primary">
              Create an account
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
