import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Users } from 'lucide-react'
import DataTable from './DataTable'
import { ConfirmDialog } from './Modal'
import { EmptyState } from './Feedback'
import { useApp } from '../context/AppContext'
import { TYPE_META, formatDate } from '../utils/helpers'

// Manage table for a recruiter's jobs or internships: view applicants,
// edit and delete.
export default function OpportunityTable({ type, items }) {
  const { applications, deleteRecord } = useApp()
  const [pendingDelete, setPendingDelete] = useState(null)
  const meta = TYPE_META[type]
  const label = meta.label.toLowerCase()

  if (items.length === 0) {
    return (
      <EmptyState
        title={`No ${meta.plural.toLowerCase()} posted`}
        message={`You haven't posted any ${meta.plural.toLowerCase()} yet.`}
        actionLabel={`Post ${meta.label}`}
        actionTo={`/recruiter/${meta.key}/new`}
      />
    )
  }

  const applicantCount = (id) =>
    applications.filter((a) => a.opportunityType === type && a.opportunityId === id).length

  const columns = [
    { label: 'Title', render: (item) => <Link to={`${meta.path}/${item.id}`}>{item.title}</Link> },
    { label: 'Location', render: (item) => item.location },
    { label: 'Deadline', render: (item) => formatDate(item.deadline) },
    { label: 'Applicants', render: (item) => applicantCount(item.id) },
    {
      label: 'Actions',
      render: (item) => (
        <div className="btn-row">
          <Link to={`/recruiter/applicants?opp=${item.id}`} className="btn btn-outline btn-sm">
            <Users size={14} /> Applicants
          </Link>
          <Link to={`/recruiter/${meta.key}/${item.id}/edit`} className="btn btn-outline btn-sm">
            <Pencil size={14} /> Edit
          </Link>
          <button type="button" className="btn btn-outline btn-sm danger-text" onClick={() => setPendingDelete(item)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} rows={items} />
      {pendingDelete && (
        <ConfirmDialog
          title={`Delete ${label}`}
          message={`"${pendingDelete.title}" will be removed from the portal. Existing applications are kept in applicants' history.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteRecord(meta.key, pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      )}
    </>
  )
}
