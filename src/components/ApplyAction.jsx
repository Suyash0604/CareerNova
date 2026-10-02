import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ApplicationForm from './ApplicationForm'
import Modal from './Modal'
import { Alert } from './Feedback'

// The whole apply flow for jobs, internships and placement drives:
// login check → student check → resume check → form → save → success.
export default function ApplyAction({ type, item, label = 'Apply Now', closedReason = '' }) {
  const { currentUser, resume, hasApplied, applyTo } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [modal, setModal] = useState(null) // 'resume' | 'form'
  const [notice, setNotice] = useState(null)

  const applied = hasApplied(type, item.id)

  const start = () => {
    setNotice(null)
    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } })
    } else if (currentUser.role !== 'student') {
      setNotice({ type: 'warning', text: 'Only student accounts can apply. Log in as a student to continue.' })
    } else {
      setModal(resume ? 'form' : 'resume')
    }
  }

  const submit = (form) => {
    const result = applyTo(type, item, form)
    if (result.ok) {
      setModal(null)
      setNotice({ type: 'success', text: 'Application submitted successfully.' })
    }
    return result
  }

  return (
    <div className="apply-action">
      {applied ? (
        <button type="button" className="btn btn-success btn-block" disabled>
          <Check size={16} /> Applied
        </button>
      ) : closedReason ? (
        <button type="button" className="btn btn-primary btn-block" disabled>
          {closedReason}
        </button>
      ) : (
        <button type="button" className="btn btn-primary btn-block" onClick={start}>
          {label}
        </button>
      )}
      {notice && <Alert type={notice.type}>{notice.text}</Alert>}
      {applied && !notice && (
        <p className="hint">
          You have already applied. Track it in <Link to="/student/applications">My Applications</Link>.
        </p>
      )}

      {modal === 'resume' && (
        <Modal
          title="Resume required"
          onClose={() => setModal(null)}
          footer={
            <>
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>
                Cancel
              </button>
              <Link to="/student/resume" className="btn btn-primary">
                Upload Resume
              </Link>
            </>
          }
        >
          <p>Please upload your resume before applying.</p>
        </Modal>
      )}

      {modal === 'form' && (
        <Modal title={label} onClose={() => setModal(null)}>
          <ApplicationForm
            item={item}
            user={currentUser}
            resume={resume}
            submitLabel="Submit Application"
            onSubmit={submit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
