import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import DashboardLayout, { Section, StatGrid } from '../../components/DashboardLayout'
import OpportunityTable from '../../components/OpportunityTable'
import { useApp } from '../../context/AppContext'

export const AddLink = ({ to, label }) => (
  <Link to={to} className="btn btn-primary btn-sm">
    <Plus size={15} /> {label}
  </Link>
)

// Everything a recruiter owns: their postings and the applications to them.
export function useRecruiterData() {
  const { currentUser, jobs, internships, applications } = useApp()
  const owns = (item) => item.postedBy === currentUser.id
  return {
    jobs: jobs.filter(owns),
    internships: internships.filter(owns),
    applicants: applications.filter((a) => a.recruiterId === currentUser.id),
  }
}

export default function RecruiterDashboard() {
  const { currentUser } = useApp()
  const { jobs, internships, applicants } = useRecruiterData()

  return (
    <DashboardLayout
      title="Recruiter Dashboard"
      subtitle={`${currentUser.companyName} · ${currentUser.designation}`}
      actions={
        <Link to="/recruiter/applicants" className="btn btn-outline btn-sm">
          View all applicants
        </Link>
      }
    >
      <StatGrid
        stats={[
          ['Total Jobs', jobs.length],
          ['Total Internships', internships.length],
          ['Total Applicants', applicants.length],
          ['Shortlisted Applicants', applicants.filter((a) => a.status === 'Shortlisted').length],
        ]}
      />
      <Section title="My Jobs" action={<AddLink to="/recruiter/jobs/new" label="Add Job" />}>
        <OpportunityTable type="job" items={jobs} />
      </Section>
      <Section title="My Internships" action={<AddLink to="/recruiter/internships/new" label="Add Internship" />}>
        <OpportunityTable type="internship" items={internships} />
      </Section>
    </DashboardLayout>
  )
}
