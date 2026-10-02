import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Alert, Field } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { dashboardPath, validateRegistration } from '../utils/auth'

const EMPTY = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'student',
  phone: '',
  college: '',
  degree: '',
  branch: '',
  graduationYear: '',
  companyName: '',
  designation: '',
}

const COMMON_FIELDS = [
  ['name', 'Full Name', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['password', 'Password', 'password', 'new-password'],
  ['confirmPassword', 'Confirm Password', 'password', 'new-password'],
  ['phone', 'Phone', 'tel', 'tel'],
]

const ROLE_FIELDS = {
  student: [
    ['college', 'College'],
    ['degree', 'Degree', 'e.g. B.Tech'],
    ['branch', 'Branch', 'e.g. Computer Engineering'],
    ['graduationYear', 'Graduation Year', 'e.g. 2027'],
  ],
  recruiter: [
    ['companyName', 'Company Name'],
    ['designation', 'Designation', 'e.g. HR Manager'],
  ],
}

export default function Register() {
  const { currentUser, users, register } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  if (currentUser) return <Navigate to={dashboardPath(currentUser.role)} replace />

  const set = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const next = validateRegistration(form, users)
    setErrors(next)
    if (Object.keys(next).length) return
    const user = register(form)
    navigate('/login', { state: { registered: true, email: user.email, role: user.role } })
  }

  const input = ([name, label, typeOrPlaceholder, autoComplete], isCommon) => (
    <Field key={name} label={label} htmlFor={`r-${name}`} error={errors[name]} required>
      <input
        id={`r-${name}`}
        className="input"
        type={isCommon ? typeOrPlaceholder : 'text'}
        placeholder={isCommon ? undefined : typeOrPlaceholder}
        autoComplete={autoComplete}
        value={form[name]}
        onChange={set(name)}
      />
    </Field>
  )

  return (
    <div className="container auth-page">
      <form className="card auth-card auth-card-wide" onSubmit={submit} noValidate>
        <h1>Create your account</h1>
        <p className="muted">Register as a student to apply, or as a recruiter to post opportunities.</p>
        {Object.keys(errors).length > 0 && <Alert type="error">Please correct the highlighted fields.</Alert>}

        <Field label="I am registering as" htmlFor="r-role" required>
          <select id="r-role" className="input" value={form.role} onChange={set('role')}>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </Field>

        <div className="form-grid">{COMMON_FIELDS.map((field) => input(field, true))}</div>

        <h2 className="form-section-title">{form.role === 'student' ? 'Academic details' : 'Company details'}</h2>
        <div className="form-grid">{ROLE_FIELDS[form.role].map((field) => input(field, false))}</div>

        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
