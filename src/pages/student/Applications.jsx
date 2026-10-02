import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import { InfoList } from '../../components/OpportunityDetails'
import { EmptyState } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { STATUSES, TYPE_META, formatDate } from '../../utils/helpers'

export default function StudentApplications() {
  const data = useApp()
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)

  const mine = data.applications.filter((a) => a.userId === data.currentUser.id)
  const visible = status ? mine.filter((a) => a.status === status) : mine
  const stillListed = (a) => data[TYPE_META[a.opportunityType].key].some((item) => item.id === a.opportunityId)

  return (
    <DashboardLayout
      title="Applications"
      subtitle="Every opportunity you have applied to and its current status."
      actions={
        mine.length > 0 && (
          <select
            className="input input-sm"
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        )
      }
    >
      {mine.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications"
          message="You haven't applied to any opportunities yet."
          actionLabel="Find Opportunities"
          actionTo="/jobs"
        />
      ) : visible.length === 0 ? (
        <EmptyState title={`No applications with status "${status}"`}>
          <button type="button" className="btn btn-primary" onClick={() => setStatus('')}>
            Show all
          </button>
        </EmptyState>
      ) : (
        <DataTable
          rows={visible}
          columns={[
            { label: 'Position', render: (a) => a.title },
            { label: 'Company', render: (a) => a.company },
            { label: 'Type', render: (a) => TYPE_META[a.opportunityType].label },
            { label: 'Applied date', render: (a) => formatDate(a.appliedAt) },
            { label: 'Status', render: (a) => <StatusBadge status={a.status} /> },
            {
              label: 'Details',
              render: (a) => (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelected(a)}>
                  View Details
                </button>
              ),
            },
          ]}
        />
      )}

      {selected && (
        <Modal
          title="Application details"
          onClose={() => setSelected(null)}
          footer={
            <>
              {stillListed(selected) && (
                <Link
                  to={`${TYPE_META[selected.opportunityType].path}/${selected.opportunityId}`}
                  className="btn btn-outline"
                >
                  View {TYPE_META[selected.opportunityType].label}
                </Link>
              )}
              <button type="button" className="btn btn-primary" onClick={() => setSelected(null)}>
                Close
              </button>
            </>
          }
        >
          <InfoList
            rows={[
              ['Position', selected.title],
              ['Company', selected.company],
              ['Type', TYPE_META[selected.opportunityType].label],
              ['Applied on', formatDate(selected.appliedAt)],
              ['Status', <StatusBadge key="status" status={selected.status} />],
              ['Resume', selected.resumeName],
              ['Phone', selected.phone],
              ['Cover message', selected.coverMessage],
            ]}
          />
          {!stillListed(selected) && <p className="hint">This listing is no longer available on the portal.</p>}
        </Modal>
      )}
    </DashboardLayout>
  )
}
