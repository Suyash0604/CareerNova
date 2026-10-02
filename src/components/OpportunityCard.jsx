import { Link } from 'react-router-dom'
import { Briefcase, Clock, GraduationCap, IndianRupee, MapPin, Monitor } from 'lucide-react'
import SaveButton from './SaveButton'
import { TYPE_META, initials, postedAgo } from '../utils/helpers'

export function CompanyAvatar({ name, size = 'md' }) {
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {initials(name)}
    </span>
  )
}

export function Meta({ items }) {
  return (
    <ul className="meta">
      {items
        .filter(([, text]) => text)
        .map(([Icon, text], index) => (
          <li key={index}>
            <Icon size={15} />
            {text}
          </li>
        ))}
    </ul>
  )
}

export function Tags({ items = [] }) {
  if (!items.length) return null
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item} className="tag">
          {item}
        </li>
      ))}
    </ul>
  )
}

export const opportunityMeta = (type, item) =>
  type === 'job'
    ? [
        [MapPin, item.location],
        [Briefcase, item.jobType],
        [GraduationCap, item.experience],
        [IndianRupee, item.salary],
      ]
    : [
        [MapPin, item.location],
        [Clock, item.duration],
        [IndianRupee, item.stipend],
        [Monitor, item.workMode],
      ]

// Shared card for jobs and internships.
export default function OpportunityCard({ type, item }) {
  const to = `${TYPE_META[type].path}/${item.id}`
  return (
    <article className="card opp-card">
      <div className="opp-head">
        <CompanyAvatar name={item.company} />
        <div className="opp-head-text">
          <h3 className="opp-title">
            <Link to={to}>{item.title}</Link>
          </h3>
          <p className="opp-company">{item.company}</p>
        </div>
      </div>
      <Meta items={opportunityMeta(type, item)} />
      <Tags items={item.skills} />
      <div className="opp-foot">
        <span className="muted small">Posted {postedAgo(item.postedAt)}</span>
        <div className="btn-row">
          <SaveButton type={type} id={item.id} />
          <Link to={to} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
