import DashboardLayout from '../../components/DashboardLayout'
import OpportunityTable from '../../components/OpportunityTable'
import { TYPE_META } from '../../utils/helpers'
import { AddLink, useRecruiterData } from './Dashboard'

// /recruiter/jobs and /recruiter/internships
export default function RecruiterOpportunities({ type }) {
  const data = useRecruiterData()
  const meta = TYPE_META[type]

  return (
    <DashboardLayout
      title={`My ${meta.plural}`}
      subtitle={`${meta.plural} you have posted on CareerNova.`}
      actions={<AddLink to={`/recruiter/${meta.key}/new`} label={`Post ${meta.label}`} />}
    >
      <OpportunityTable type={type} items={data[meta.key]} />
    </DashboardLayout>
  )
}
