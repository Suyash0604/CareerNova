import { Link } from 'react-router-dom'
import DashboardLayout, { Section, StatGrid } from '../../components/DashboardLayout'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { Alert, EmptyState } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { PENDING_STATUSES, TYPE_META, formatDate } from '../../utils/helpers'

const QUICK_ACTIONS = [
  ['/jobs', 'Find Jobs'],
  ['/internships', 'Find Internships'],
  ['/student/resume', 'Upload Resume'],
  ['/student/profile', 'Edit Profile'],
  ['/student/applications', 'View Applications'],
]

// Saved items of one type that still exist on the portal.
export function useSaved(type) {
  const data = useApp()
  const meta = TYPE_META[type]
  const ids = data[meta.savedKey][data.currentUser.id] || []
  return data[meta.key].filter((item) => ids.includes(item.id))
}

export default function StudentDashboard() {
  const { currentUser, applications, resume } = useApp()
  const mine = applications.filter((a) => a.userId === currentUser.id)
  const savedJobs = useSaved('job')
  const savedInternships = useSaved('internship')
  const saved = [
    ...savedJobs.map((item) => ({ ...item, type: 'job' })),
    ...savedInternships.map((item) => ({ ...item, type: 'internship' })),
  ]

  return (
    <DashboardLayout title={`Welcome, ${currentUser.name.split(' ')[0]}`} subtitle="Here is a summary of your activity.">
      {!resume && (
        <Alert type="warning">
          You have not uploaded a resume yet. <Link to="/student/resume">Upload your resume</Link> to start applying.
        </Alert>
      )}

      <StatGrid
        stats={[
          ['Saved Jobs', savedJobs.length],
          ['Saved Internships', savedInternships.length],
          ['Applications', mine.length],
          ['Pending Applications', mine.filter((a) => PENDING_STATUSES.includes(a.status)).length],
        ]}
      />

      <Section title="Quick Actions">
        <div className="btn-row">
          {QUICK_ACTIONS.map(([to, label]) => (
            <Link key={to} to={to} className="btn btn-outline">
              {label}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Recent Applications" action={mine.length > 0 && <Link to="/student/applications">View all</Link>}>
        {mine.length === 0 ? (
          <EmptyState
            title="No applications"
            message="You haven't applied to any opportunities yet."
            actionLabel="Find Opportunities"
            actionTo="/jobs"
          />
        ) : (
          <DataTable
            rows={mine.slice(0, 5)}
            columns={[
              { label: 'Opportunity', render: (a) => a.title },
              { label: 'Company', render: (a) => a.company },
              { label: 'Applied date', render: (a) => formatDate(a.appliedAt) },
              { label: 'Status', render: (a) => <StatusBadge status={a.status} /> },
            ]}
          />
        )}
      </Section>

      <Section title="Saved Opportunities" action={saved.length > 0 && <Link to="/student/saved">View all</Link>}>
        {saved.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            message="Save jobs and internships to come back to them later."
            actionLabel="Explore Jobs"
            actionTo="/jobs"
          />
        ) : (
          <DataTable
            rows={saved.slice(0, 5)}
            columns={[
              {
                label: 'Opportunity',
                render: (item) => <Link to={`${TYPE_META[item.type].path}/${item.id}`}>{item.title}</Link>,
              },
              { label: 'Company', render: (item) => item.company },
              { label: 'Type', render: (item) => TYPE_META[item.type].label },
              { label: 'Apply by', render: (item) => formatDate(item.deadline) },
            ]}
          />
        )}
      </Section>
    </DashboardLayout>
  )
}
