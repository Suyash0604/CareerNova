import DashboardLayout from '../../components/DashboardLayout'
import ResumeUpload from '../../components/ResumeUpload'

export default function StudentResume() {
  return (
    <DashboardLayout title="Resume" subtitle="Your uploaded resume is attached to every application you submit.">
      <ResumeUpload />
    </DashboardLayout>
  )
}
