import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Alert, Field } from './Feedback'
import { isEmail, isPhone } from '../utils/auth'

export default function ApplicationForm({ item, user, resume, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    coverMessage: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const set = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!isEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!isPhone(form.phone)) next.phone = 'Enter a valid 10-digit mobile number.'
    setErrors(next)
    if (Object.keys(next).length) return
    const result = onSubmit(form)
    if (!result.ok) setSubmitError(result.error)
  }

  return (
    <form onSubmit={submit} noValidate>
      <p className="muted form-intro">
        {item.title} · {item.company}
      </p>
      {submitError && <Alert type="error">{submitError}</Alert>}
      <Field label="Name" htmlFor="app-name" error={errors.name} required>
        <input id="app-name" className="input" value={form.name} onChange={set('name')} />
      </Field>
      <div className="form-grid">
        <Field label="Email" htmlFor="app-email" error={errors.email} required>
          <input id="app-email" type="email" className="input" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Phone" htmlFor="app-phone" error={errors.phone} required>
          <input id="app-phone" type="tel" className="input" value={form.phone} onChange={set('phone')} />
        </Field>
      </div>
      <div className="field">
        <span className="field-label">Resume</span>
        <div className="resume-file compact">
          <FileText size={18} />
          <span className="resume-name">{resume.fileName}</span>
          <Link to="/student/resume" className="small">
            Change
          </Link>
        </div>
      </div>
      <Field label="Cover message" htmlFor="app-cover" hint="Optional. A few lines on why you are a good fit.">
        <textarea
          id="app-cover"
          className="input"
          rows={4}
          maxLength={1000}
          value={form.coverMessage}
          onChange={set('coverMessage')}
        />
      </Field>
      <div className="modal-foot inline">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
