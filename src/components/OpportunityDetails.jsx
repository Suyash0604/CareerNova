import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import ApplyAction from './ApplyAction'
import SaveButton from './SaveButton'
import { CompanyAvatar, Meta, Tags, opportunityMeta } from './OpportunityCard'
import { EmptyState } from './Feedback'
import { useApp } from '../context/AppContext'
import { TYPE_META, formatDate, isPast } from '../utils/helpers'

export function DetailHeader({ backTo, backLabel, company, companyId, title, children }) {
  return (
    <>
      <Link to={backTo} className="back-link">
        <ChevronLeft size={16} /> {backLabel}
      </Link>
      <div className="card detail-header">
        <CompanyAvatar name={company} size="lg" />
        <div>
          <h1>{title}</h1>
          <p className="opp-company">{companyId ? <Link to={`/companies/${companyId}`}>{company}</Link> : company}</p>
          {children}
        </div>
      </div>
    </>
  )
}

export function BulletSection({ title, items }) {
  if (!items?.length) return null
  return (
    <section>
      <h2>{title}</h2>
      <ul className="detail-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function InfoList({ rows }) {
  return (
    <dl className="info-list">
      {rows
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  )
}

const summaryRows = (type, item) =>
  type === 'job'
    ? [
        ['Job type', item.jobType],
        ['Experience', item.experience],
        ['Salary', item.salary],
        ['Location', item.location],
        ['Posted on', formatDate(item.postedAt)],
        ['Apply by', formatDate(item.deadline)],
      ]
    : [
        ['Duration', item.duration],
        ['Stipend', item.stipend],
        ['Work mode', item.workMode],
        ['Internship type', item.internshipType],
        ['Location', item.location],
        ['Posted on', formatDate(item.postedAt)],
        ['Apply by', formatDate(item.deadline)],
      ]

// Detail page shared by /jobs/:id and /internships/:id.
export default function OpportunityDetails({ type }) {
  const { id } = useParams()
  const data = useApp()
  const meta = TYPE_META[type]
  const item = data[meta.key].find((record) => record.id === id)

  if (!item) {
    return (
      <div className="container section">
        <EmptyState
          title={`${meta.label} not found`}
          message={`This ${meta.label.toLowerCase()} may have been removed or the link is incorrect.`}
          actionLabel={`Browse ${meta.plural}`}
          actionTo={meta.path}
        />
      </div>
    )
  }

  return (
    <div className="container detail-page">
      <DetailHeader
        backTo={meta.path}
        backLabel={`All ${meta.plural.toLowerCase()}`}
        company={item.company}
        companyId={item.companyId}
        title={item.title}
      >
        <Meta items={opportunityMeta(type, item)} />
      </DetailHeader>

      <div className="detail-layout">
        <div className="card detail-main">
          <section>
            <h2>Description</h2>
            <p>{item.description}</p>
          </section>
          <BulletSection title="Responsibilities" items={item.responsibilities} />
          <BulletSection title="Requirements" items={item.requirements} />
          {item.skills?.length > 0 && (
            <section>
              <h2>Skills</h2>
              <Tags items={item.skills} />
            </section>
          )}
          <BulletSection title="Benefits" items={item.benefits} />
        </div>

        <aside className="card detail-side">
          <h2 className="card-title">{meta.label} summary</h2>
          <InfoList rows={summaryRows(type, item)} />
          <ApplyAction key={item.id} type={type} item={item} closedReason={isPast(item.deadline) ? 'Applications closed' : ''} />
          <SaveButton type={type} id={item.id} block />
        </aside>
      </div>
    </div>
  )
}
