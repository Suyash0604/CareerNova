import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Alert, Field } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { isEmail } from '../utils/auth'

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { currentUser, addContactMessage } = useApp()
  const [form, setForm] = useState({ ...EMPTY, name: currentUser?.name || '', email: currentUser?.email || '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }))
    setSent(false)
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!isEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!form.subject.trim()) next.subject = 'Subject is required.'
    if (form.message.trim().length < 10) next.message = 'Please write at least 10 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    addContactMessage(form)
    setForm(EMPTY)
    setSent(true)
  }

  return (
    <>
      <PageHeader title="Contact" subtitle="Questions about the portal, a listing or your account? Write to us." />
      <div className="container section section-tight contact-layout">
        <form className="card" onSubmit={submit} noValidate>
          {sent && <Alert type="success">Your message has been submitted successfully.</Alert>}
          <div className="form-grid">
            <Field label="Name" htmlFor="c-name" error={errors.name} required>
              <input id="c-name" className="input" value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Email" htmlFor="c-email" error={errors.email} required>
              <input id="c-email" type="email" className="input" value={form.email} onChange={set('email')} />
            </Field>
          </div>
          <Field label="Subject" htmlFor="c-subject" error={errors.subject} required>
            <input id="c-subject" className="input" value={form.subject} onChange={set('subject')} />
          </Field>
          <Field label="Message" htmlFor="c-message" error={errors.message} required>
            <textarea id="c-message" className="input" rows={6} value={form.message} onChange={set('message')} />
          </Field>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>

        <aside className="card">
          <h2 className="card-title">Career Cell</h2>
          <ul className="contact-list">
            <li>
              <MapPin size={16} /> CareerNova Career Cell, Shivajinagar, Pune 411005
            </li>
            <li>
              <Mail size={16} /> support@careernova.example
            </li>
            <li>
              <Phone size={16} /> +91 20 5550 0142
            </li>
          </ul>
          <p className="muted small">Monday to Friday, 10:00 am – 5:30 pm. Contact details are for demonstration.</p>
        </aside>
      </div>
    </>
  )
}
