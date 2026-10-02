import { Link } from 'react-router-dom'
import { Bookmark, Trash2 } from 'lucide-react'
import DashboardLayout, { Section } from '../../components/DashboardLayout'
import { CompanyAvatar, Meta, opportunityMeta } from '../../components/OpportunityCard'
import { EmptyState } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { TYPE_META } from '../../utils/helpers'
import { useSaved } from './Dashboard'

function SavedList({ type, emptyTitle, emptyMessage }) {
  const { toggleSaved } = useApp()
  const items = useSaved(type)
  const meta = TYPE_META[type]

  return (
    <Section title={`Saved ${meta.plural} (${items.length})`}>
      {items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={emptyTitle}
          message={emptyMessage}
          actionLabel={`Explore ${meta.plural}`}
          actionTo={meta.path}
        />
      ) : (
        <div className="stack">
          {items.map((item) => (
            <article key={item.id} className="card opp-card">
              <div className="opp-head">
                <CompanyAvatar name={item.company} />
                <div className="opp-head-text">
                  <h3 className="opp-title">
                    <Link to={`${meta.path}/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="opp-company">{item.company}</p>
                </div>
              </div>
              <Meta items={opportunityMeta(type, item)} />
              <div className="opp-foot">
                <span />
                <div className="btn-row">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm danger-text"
                    onClick={() => toggleSaved(type, item.id)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                  <Link to={`${meta.path}/${item.id}`} className="btn btn-primary btn-sm">
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}

export default function StudentSaved() {
  return (
    <DashboardLayout title="Saved" subtitle="Jobs and internships you have saved for later.">
      <SavedList type="job" emptyTitle="No saved jobs" emptyMessage="You haven't saved any jobs yet." />
      <SavedList
        type="internship"
        emptyTitle="No saved internships"
        emptyMessage="You haven't saved any internships yet."
      />
    </DashboardLayout>
  )
}
