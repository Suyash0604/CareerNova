import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Globe, MapPin, Users } from 'lucide-react'
import OpportunityCard, { CompanyAvatar, Meta } from '../components/OpportunityCard'
import { InfoList } from '../components/OpportunityDetails'
import { EmptyState } from '../components/Feedback'
import { useApp } from '../context/AppContext'

function OpeningList({ title, type, items, emptyText }) {
  return (
    <section className="dash-section">
      <div className="section-head">
        <h2>
          {title} ({items.length})
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="card muted">{emptyText}</p>
      ) : (
        <div className="stack">
          {items.map((item) => (
            <OpportunityCard key={item.id} type={type} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function CompanyDetails() {
  const { id } = useParams()
  const { companies, jobs, internships } = useApp()
  const company = companies.find((record) => record.id === id)

  if (!company) {
    return (
      <div className="container section">
        <EmptyState
          title="Company not found"
          message="This company may have been removed or the link is incorrect."
          actionLabel="Browse Companies"
          actionTo="/companies"
        />
      </div>
    )
  }

  return (
    <div className="container detail-page">
      <Link to="/companies" className="back-link">
        <ChevronLeft size={16} /> All companies
      </Link>
      <div className="card detail-header">
        <CompanyAvatar name={company.name} size="lg" />
        <div>
          <h1>{company.name}</h1>
          <p className="opp-company">{company.industry || 'Industry not specified'}</p>
          <Meta
            items={[
              [MapPin, company.location],
              [Users, company.size],
              [Globe, company.website],
            ]}
          />
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <div className="card detail-main">
            <section>
              <h2>About {company.name}</h2>
              <p>{company.about || company.description || 'This company has not added a description yet.'}</p>
            </section>
          </div>
          <OpeningList
            title="Jobs"
            type="job"
            items={jobs.filter((job) => job.companyId === company.id)}
            emptyText="No open jobs at the moment."
          />
          <OpeningList
            title="Internships"
            type="internship"
            items={internships.filter((item) => item.companyId === company.id)}
            emptyText="No open internships at the moment."
          />
        </div>

        <aside className="card detail-side">
          <h2 className="card-title">Company overview</h2>
          <InfoList
            rows={[
              ['Industry', company.industry],
              ['Headquarters', company.location],
              ['Company size', company.size],
              ['Website', company.website],
            ]}
          />
        </aside>
      </div>
    </div>
  )
}
