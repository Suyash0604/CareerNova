import { Link } from 'react-router-dom'
import { Building2, MapPin, Users } from 'lucide-react'
import { CompanyAvatar, Meta } from './OpportunityCard'
import { useApp } from '../context/AppContext'

export default function CompanyCard({ company }) {
  const { jobs, internships } = useApp()
  const jobCount = jobs.filter((job) => job.companyId === company.id).length
  const internshipCount = internships.filter((item) => item.companyId === company.id).length
  const to = `/companies/${company.id}`

  return (
    <article className="card opp-card">
      <div className="opp-head">
        <CompanyAvatar name={company.name} />
        <div className="opp-head-text">
          <h3 className="opp-title">
            <Link to={to}>{company.name}</Link>
          </h3>
          <p className="opp-company">{company.industry || 'Industry not specified'}</p>
        </div>
      </div>
      <Meta
        items={[
          [MapPin, company.location],
          [Users, company.size],
        ]}
      />
      {company.description && <p className="opp-desc">{company.description}</p>}
      <div className="opp-foot">
        <span className="muted small">
          <Building2 size={14} /> {jobCount} {jobCount === 1 ? 'job' : 'jobs'} · {internshipCount}{' '}
          {internshipCount === 1 ? 'internship' : 'internships'}
        </span>
        <Link to={to} className="btn btn-primary btn-sm">
          View Company
        </Link>
      </div>
    </article>
  )
}
