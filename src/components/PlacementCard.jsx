import { Link } from 'react-router-dom'
import { CompanyAvatar } from './OpportunityCard'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/helpers'

export const placementFacts = (drive) => [
  ['Eligibility', drive.eligibility],
  ['Degree', drive.degrees.join(', ')],
  ['Branch', drive.branches.join(', ')],
  ['Graduation year', drive.graduationYear],
  ['Location', drive.location],
  ['Package', drive.package],
  ['Drive date', formatDate(drive.driveDate)],
  ['Registration deadline', formatDate(drive.deadline)],
]

export default function PlacementCard({ drive }) {
  const to = `/placements/${drive.id}`
  return (
    <article className="card opp-card">
      <div className="opp-head">
        <CompanyAvatar name={drive.company} />
        <div className="opp-head-text">
          <h3 className="opp-title">
            <Link to={to}>{drive.title}</Link>
          </h3>
          <p className="opp-company">{drive.company}</p>
        </div>
        <StatusBadge status={drive.status} />
      </div>
      <dl className="facts">
        {placementFacts(drive).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="opp-foot">
        <span />
        <Link to={to} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </article>
  )
}
