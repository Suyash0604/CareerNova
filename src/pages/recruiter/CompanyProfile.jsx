import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { Alert, EmptyState, Field } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'

const FIELDS = [
  ['name', 'Company name', true],
  ['industry', 'Industry'],
  ['location', 'Headquarters'],
  ['size', 'Company size', false, 'e.g. 200–500 employees'],
  ['website', 'Website', false, 'www.example.com'],
]

export default function CompanyProfile() {
  const { currentUser, companies, updateCompany } = useApp()
  const company = companies.find((c) => c.id === currentUser.companyId)
  const [form, setForm] = useState(company)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  if (!company) {
    return (
      <DashboardLayout title="Company Profile">
        <EmptyState
          title="Company profile not found"
          message="The company linked to your account has been removed from the portal."
          actionLabel="Contact support"
          actionTo="/contact"
        />
      </DashboardLayout>
    )
  }

  const set = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }))
    setSaved(false)
  }

  const submit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setError('Company name is required.')
      return
    }
    if (companies.some((c) => c.id !== company.id && c.name.toLowerCase() === name.toLowerCase())) {
      setError('Another company on the portal already uses this name.')
      return
    }
    setError('')
    updateCompany(company.id, { ...form, name })
    setSaved(true)
  }

  return (
    <DashboardLayout
      title="Company Profile"
      subtitle="This information is shown to students on your company page."
      actions={
        <Link to={`/companies/${company.id}`} className="btn btn-outline btn-sm">
          View public page
        </Link>
      }
    >
      <form className="card" onSubmit={submit} noValidate>
        {saved && <Alert type="success">Company profile saved.</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <div className="form-grid">
          {FIELDS.map(([name, label, required, placeholder]) => (
            <Field key={name} label={label} htmlFor={`co-${name}`} required={required}>
              <input
                id={`co-${name}`}
                className="input"
                placeholder={placeholder}
                value={form[name] || ''}
                onChange={set(name)}
              />
            </Field>
          ))}
        </div>
        <Field label="Short description" htmlFor="co-description" hint="One sentence shown on company cards.">
          <input id="co-description" className="input" value={form.description || ''} onChange={set('description')} />
        </Field>
        <Field label="About the company" htmlFor="co-about">
          <textarea id="co-about" className="input" rows={5} value={form.about || ''} onChange={set('about')} />
        </Field>
        <button type="submit" className="btn btn-primary">
          Save Company Profile
        </button>
      </form>
    </DashboardLayout>
  )
}
