import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import DashboardLayout, { StatGrid } from '../../components/DashboardLayout'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { ConfirmDialog } from '../../components/Modal'
import { EmptyState } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { TYPE_META, formatDate } from '../../utils/helpers'
import { ResumeButton, StatusSelect } from '../recruiter/Applicants'

const viewLink = (path, labelField) => (row) => <Link to={`${path}/${row.id}`}>{row[labelField]}</Link>

// One entry per admin section: which storage key it manages and its columns.
// `name` is how a record is described in the delete confirmation.
const TABS = [
  {
    key: 'users',
    label: 'Users',
    name: (row) => row.name,
    columns: [
      { label: 'Name', render: (row) => row.name },
      { label: 'Email', render: (row) => row.email },
      { label: 'Role', render: (row) => row.role[0].toUpperCase() + row.role.slice(1) },
      { label: 'College / Company', render: (row) => row.college || row.companyName || '—' },
      { label: 'Joined', render: (row) => formatDate(row.createdAt) },
    ],
  },
  ...['job', 'internship'].map((type) => ({
    key: TYPE_META[type].key,
    label: TYPE_META[type].plural,
    name: (row) => row.title,
    editPath: (row) => `/recruiter/${TYPE_META[type].key}/${row.id}/edit`,
    columns: [
      { label: 'Title', render: viewLink(TYPE_META[type].path, 'title') },
      { label: 'Company', render: (row) => row.company },
      { label: 'Location', render: (row) => row.location },
      { label: type === 'job' ? 'Salary' : 'Stipend', render: (row) => row.salary || row.stipend },
      { label: 'Deadline', render: (row) => formatDate(row.deadline) },
    ],
  })),
  {
    key: 'companies',
    label: 'Companies',
    name: (row) => row.name,
    columns: [
      { label: 'Company', render: viewLink('/companies', 'name') },
      { label: 'Industry', render: (row) => row.industry || '—' },
      { label: 'Location', render: (row) => row.location || '—' },
      { label: 'Size', render: (row) => row.size || '—' },
    ],
  },
  {
    key: 'placements',
    label: 'Placements',
    name: (row) => row.title,
    columns: [
      { label: 'Drive', render: viewLink('/placements', 'title') },
      { label: 'Company', render: (row) => row.company },
      { label: 'Package', render: (row) => row.package },
      { label: 'Drive date', render: (row) => formatDate(row.driveDate) },
      { label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    ],
  },
  {
    key: 'applications',
    label: 'Applications',
    name: (row) => `${row.name}'s application for ${row.title}`,
    columns: [
      { label: 'Applicant', render: (row) => row.name },
      { label: 'Position', render: (row) => row.title },
      { label: 'Company', render: (row) => row.company },
      { label: 'Type', render: (row) => TYPE_META[row.opportunityType].label },
      { label: 'Applied', render: (row) => formatDate(row.appliedAt) },
      { label: 'Resume', render: (row) => <ResumeButton userId={row.userId} /> },
      { label: 'Status', render: (row) => <StatusSelect application={row} /> },
    ],
  },
]

export default function AdminDashboard() {
  const data = useApp()
  const [params, setParams] = useSearchParams()
  const [pendingDelete, setPendingDelete] = useState(null)
  const tab = TABS.find((t) => t.key === params.get('tab')) || TABS[0]
  const rows = data[tab.key]

  const columns = [
    ...tab.columns,
    {
      label: 'Actions',
      render: (row) => (
        <div className="btn-row">
          {tab.editPath && (
            <Link to={tab.editPath(row)} className="btn btn-outline btn-sm">
              <Pencil size={14} /> Edit
            </Link>
          )}
          {tab.key === 'users' && row.id === data.currentUser.id ? (
            <span className="muted small">Your account</span>
          ) : (
            <button type="button" className="btn btn-outline btn-sm danger-text" onClick={() => setPendingDelete(row)}>
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview of everything on the portal.">
      <StatGrid
        stats={[
          ['Total Students', data.users.filter((u) => u.role === 'student').length],
          ['Total Recruiters', data.users.filter((u) => u.role === 'recruiter').length],
          ['Total Companies', data.companies.length],
          ['Total Jobs', data.jobs.length],
          ['Total Internships', data.internships.length],
          ['Total Applications', data.applications.length],
        ]}
      />

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === tab.key}
            className={`tab ${t.key === tab.key ? 'active' : ''}`}
            onClick={() => setParams({ tab: t.key })}
          >
            {t.label} ({data[t.key].length})
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState title={`No ${tab.label.toLowerCase()}`} message="There are no records in this section yet." />
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete record"
          message={`Delete ${tab.name(pendingDelete)}? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            data.deleteRecord(tab.key, pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
