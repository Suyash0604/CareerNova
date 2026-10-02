import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { Alert, EmptyState, Field } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { dashboardPath } from '../../utils/auth'
import {
  EXPERIENCE_LEVELS,
  INTERNSHIP_TYPES,
  JOB_TYPES,
  LOCATIONS,
  TYPE_META,
  WORK_MODES,
  daysFromNow,
  toLines,
  toSkills,
} from '../../utils/helpers'

// [name, label, kind, options | placeholder]
const SPECIFIC_FIELDS = {
  job: [
    ['jobType', 'Job type', 'select', JOB_TYPES],
    ['experience', 'Experience', 'select', EXPERIENCE_LEVELS],
    ['salary', 'Salary', 'text', 'e.g. ₹5 – 7 LPA'],
  ],
  internship: [
    ['duration', 'Duration', 'text', 'e.g. 3 months'],
    ['stipend', 'Stipend', 'text', 'e.g. ₹15,000 / month'],
    ['workMode', 'Work mode', 'select', WORK_MODES],
    ['internshipType', 'Internship type', 'select', INTERNSHIP_TYPES],
  ],
}

const LIST_FIELDS = ['responsibilities', 'requirements']

const initialForm = (type, item, companyName) => ({
  title: item?.title || '',
  company: item?.company || companyName || '',
  location: item?.location || '',
  ...Object.fromEntries(SPECIFIC_FIELDS[type].map(([name]) => [name, item?.[name] || ''])),
  description: item?.description || '',
  responsibilities: (item?.responsibilities || []).join('\n'),
  requirements: (item?.requirements || []).join('\n'),
  skills: (item?.skills || []).join(', '),
  deadline: item?.deadline || '',
})

// Post / edit form for jobs and internships. Admins can edit any posting;
// recruiters only their own.
export default function OpportunityForm({ type }) {
  const { id } = useParams()
  const data = useApp()
  const navigate = useNavigate()
  const meta = TYPE_META[type]
  const { currentUser } = data
  const existing = id ? data[meta.key].find((item) => item.id === id) : null
  const [form, setForm] = useState(() => initialForm(type, existing, currentUser.companyName))
  const [errors, setErrors] = useState({})

  const listPath = currentUser.role === 'admin' ? dashboardPath('admin') : `/recruiter/${meta.key}`

  if (id && (!existing || (currentUser.role === 'recruiter' && existing.postedBy !== currentUser.id))) {
    return (
      <DashboardLayout title={`Edit ${meta.label}`}>
        <EmptyState
          title={`${meta.label} not found`}
          message={`This ${meta.label.toLowerCase()} does not exist or you do not have permission to edit it.`}
          actionLabel="Back"
          actionTo={listPath}
        />
      </DashboardLayout>
    )
  }

  const set = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    Object.entries(form).forEach(([name, value]) => {
      if (!value.trim()) next[name] = 'This field is required.'
    })
    if (form.deadline && !existing && form.deadline < daysFromNow(0)) next.deadline = 'Deadline cannot be in the past.'
    setErrors(next)
    if (Object.keys(next).length) return

    saveOpportunity()
    navigate(listPath)
  }

  const saveOpportunity = () =>
    data.saveOpportunity(
      type,
      {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        responsibilities: toLines(form.responsibilities),
        requirements: toLines(form.requirements),
        skills: toSkills(form.skills),
      },
      id,
    )

  const control = ([name, label, kind, extra]) => (
    <Field key={name} label={label} htmlFor={`o-${name}`} error={errors[name]} required>
      {kind === 'select' ? (
        <select id={`o-${name}`} className="input" value={form[name]} onChange={set(name)}>
          <option value="">Select</option>
          {extra.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          id={`o-${name}`}
          type={kind}
          className="input"
          placeholder={extra}
          value={form[name]}
          onChange={set(name)}
        />
      )}
    </Field>
  )

  // Keep a custom location selectable when editing a record that has one.
  const locations = LOCATIONS.includes(form.location) || !form.location ? LOCATIONS : [form.location, ...LOCATIONS]

  return (
    <DashboardLayout
      title={existing ? `Edit ${meta.label}` : `Post ${meta.label}`}
      subtitle={existing ? existing.title : `Students are notified when a new ${meta.label.toLowerCase()} is posted.`}
    >
      <form className="card" onSubmit={submit} noValidate>
        {Object.keys(errors).length > 0 && <Alert type="error">Please fill in all required fields.</Alert>}

        <div className="form-grid">
          {control(['title', `${meta.label} title`, 'text'])}
          <Field label="Company" htmlFor="o-company" hint="Taken from your company profile." error={errors.company}>
            <input id="o-company" className="input" value={form.company} readOnly />
          </Field>
          {control(['location', 'Location', 'select', locations])}
          {SPECIFIC_FIELDS[type].map(control)}
          {control(['deadline', 'Application deadline', 'date'])}
        </div>

        <Field label="Description" htmlFor="o-description" error={errors.description} required>
          <textarea
            id="o-description"
            className="input"
            rows={4}
            value={form.description}
            onChange={set('description')}
          />
        </Field>
        {LIST_FIELDS.map((name) => (
          <Field
            key={name}
            label={name[0].toUpperCase() + name.slice(1)}
            htmlFor={`o-${name}`}
            hint="One point per line."
            error={errors[name]}
            required
          >
            <textarea id={`o-${name}`} className="input" rows={4} value={form[name]} onChange={set(name)} />
          </Field>
        ))}
        <Field label="Skills" htmlFor="o-skills" hint="Separate skills with commas." error={errors.skills} required>
          <input id="o-skills" className="input" value={form.skills} onChange={set('skills')} />
        </Field>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">
            {existing ? 'Save Changes' : `Post ${meta.label}`}
          </button>
          <Link to={listPath} className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </DashboardLayout>
  )
}
