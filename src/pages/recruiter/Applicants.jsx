import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, Users } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import { InfoList } from '../../components/OpportunityDetails'
import { EmptyState } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { STATUSES, formatDate, openStoredFile } from '../../utils/helpers'
import { useRecruiterData } from './Dashboard'

export function StatusSelect({ application }) {
  const { setApplicationStatus } = useApp()
  return (
    <select
      className="input input-sm"
      aria-label={`Status for ${application.name}`}
      value={application.status}
      onChange={(event) => setApplicationStatus(application.id, event.target.value)}
    >
      {STATUSES.map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
  )
}

export function ResumeButton({ userId }) {
  const { resumes } = useApp()
  const resume = resumes[userId]
  if (!resume) return <span className="muted small">Not available</span>
  return (
    <button type="button" className="btn btn-outline btn-sm" onClick={() => openStoredFile(resume)}>
      <Eye size={14} /> View
    </button>
  )
}

export default function RecruiterApplicants() {
  const { users } = useApp()
  const { jobs, internships, applicants } = useRecruiterData()
  const [params, setParams] = useSearchParams()
  const [selected, setSelected] = useState(null)
  const opportunityId = params.get('opp') || ''

  const postings = [...jobs, ...internships]
  const visible = opportunityId ? applicants.filter((a) => a.opportunityId === opportunityId) : applicants
  // Read the live record so the modal reflects status changes.
  const selectedApplication = selected && applicants.find((a) => a.id === selected)
  const student = selectedApplication && users.find((u) => u.id === selectedApplication.userId)

  return (
    <DashboardLayout
      title="Applicants"
      subtitle="Review applications and update their status. Students are notified of every change."
      actions={
        postings.length > 0 && (
          <select
            className="input input-sm"
            aria-label="Filter by posting"
            value={opportunityId}
            onChange={(event) => setParams(event.target.value ? { opp: event.target.value } : {})}
          >
            <option value="">All postings</option>
            {postings.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        )
      }
    >
      {visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          message={
            opportunityId
              ? 'Nobody has applied to this posting yet.'
              : 'Applications to your jobs and internships will appear here.'
          }
        />
      ) : (
        <DataTable
          rows={visible}
          columns={[
            {
              label: 'Applicant',
              render: (a) => (
                <button type="button" className="link-btn" onClick={() => setSelected(a.id)}>
                  {a.name}
                </button>
              ),
            },
            { label: 'Email', render: (a) => a.email },
            { label: 'Applied position', render: (a) => a.title },
            { label: 'Applied date', render: (a) => formatDate(a.appliedAt) },
            { label: 'Resume', render: (a) => <ResumeButton userId={a.userId} /> },
            { label: 'Status', render: (a) => <StatusSelect application={a} /> },
          ]}
        />
      )}

      {selectedApplication && (
        <Modal
          title="Applicant information"
          onClose={() => setSelected(null)}
          footer={
            <button type="button" className="btn btn-primary" onClick={() => setSelected(null)}>
              Close
            </button>
          }
        >
          <InfoList
            rows={[
              ['Name', selectedApplication.name],
              ['Email', selectedApplication.email],
              ['Phone', selectedApplication.phone],
              ['Applied for', selectedApplication.title],
              ['Applied on', formatDate(selectedApplication.appliedAt)],
              ['Status', <StatusBadge key="status" status={selectedApplication.status} />],
              ['College', student?.college],
              ['Degree', student && [student.degree, student.branch].filter(Boolean).join(', ')],
              ['Graduation year', student?.graduationYear],
              ['Skills', student?.skills?.join(', ')],
              ['LinkedIn', student?.linkedin],
              ['GitHub', student?.github],
              ['About', student?.about],
              ['Cover message', selectedApplication.coverMessage],
              ['Resume', <ResumeButton key="resume" userId={selectedApplication.userId} />],
            ]}
          />
        </Modal>
      )}
    </DashboardLayout>
  )
}
