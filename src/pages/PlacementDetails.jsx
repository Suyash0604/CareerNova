import { useParams } from 'react-router-dom'
import ApplyAction from '../components/ApplyAction'
import StatusBadge from '../components/StatusBadge'
import { BulletSection, DetailHeader, InfoList } from '../components/OpportunityDetails'
import { placementFacts } from '../components/PlacementCard'
import { EmptyState } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { isPast } from '../utils/helpers'

const closedReason = (drive) => {
  if (drive.status === 'Closed' || isPast(drive.deadline)) return 'Registration closed'
  if (drive.status === 'Upcoming') return 'Registration opens soon'
  return ''
}

export default function PlacementDetails() {
  const { id } = useParams()
  const { placements } = useApp()
  const drive = placements.find((record) => record.id === id)

  if (!drive) {
    return (
      <div className="container section">
        <EmptyState
          title="Placement drive not found"
          message="This drive may have been removed or the link is incorrect."
          actionLabel="Browse Placement Drives"
          actionTo="/placements"
        />
      </div>
    )
  }

  return (
    <div className="container detail-page">
      <DetailHeader
        backTo="/placements"
        backLabel="All placement drives"
        company={drive.company}
        companyId={drive.companyId}
        title={drive.title}
      >
        <StatusBadge status={drive.status} />
      </DetailHeader>

      <div className="detail-layout">
        <div className="card detail-main">
          <section>
            <h2>About the drive</h2>
            <p>{drive.description}</p>
          </section>
          <section>
            <h2>Eligibility</h2>
            <InfoList rows={placementFacts(drive).slice(0, 4)} />
          </section>
          <BulletSection title="Selection process" items={drive.process} />
        </div>

        <aside className="card detail-side">
          <h2 className="card-title">Drive summary</h2>
          <InfoList rows={placementFacts(drive).slice(4)} />
          <ApplyAction
            key={drive.id}
            type="placement"
            item={drive}
            label="Register for Drive"
            closedReason={closedReason(drive)}
          />
        </aside>
      </div>
    </div>
  )
}
