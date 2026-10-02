import { useRef, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { Alert, Field } from '../../components/Feedback'
import { useApp } from '../../context/AppContext'
import { isEmail, isPhone } from '../../utils/auth'
import { MAX_AVATAR_BYTES, fileToDataUrl, initials, toSkills } from '../../utils/helpers'

const FIELDS = [
  ['name', 'Name', 'text'],
  ['email', 'Email', 'email'],
  ['phone', 'Phone', 'tel'],
  ['college', 'College', 'text'],
  ['degree', 'Degree', 'text'],
  ['branch', 'Branch', 'text'],
  ['graduationYear', 'Graduation year', 'text'],
  ['linkedin', 'LinkedIn', 'url', 'https://linkedin.com/in/your-name'],
  ['github', 'GitHub', 'url', 'https://github.com/your-username'],
]

export default function StudentProfile() {
  const { currentUser, updateProfile } = useApp()
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    ...Object.fromEntries(FIELDS.map(([name]) => [name, currentUser[name] || ''])),
    skills: (currentUser.skills || []).join(', '),
    about: currentUser.about || '',
    avatar: currentUser.avatar || '',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)

  const set = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }))
    setMessage(null)
  }

  const onPhoto = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please choose an image file for your profile photo.' })
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setMessage({ type: 'error', text: 'Profile photo must be smaller than 300 KB.' })
      return
    }
    const avatar = await fileToDataUrl(file)
    setForm((prev) => ({ ...prev, avatar }))
    setMessage({ type: 'info', text: 'Photo selected. Save your profile to keep it.' })
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!isEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!isPhone(form.phone)) next.phone = 'Enter a valid 10-digit mobile number.'
    if (form.graduationYear && !/^20\d{2}$/.test(form.graduationYear)) next.graduationYear = 'Enter a valid year.'
    setErrors(next)
    if (Object.keys(next).length) {
      setMessage({ type: 'error', text: 'Please correct the highlighted fields.' })
      return
    }
    const result = updateProfile({ ...form, name: form.name.trim(), skills: toSkills(form.skills) })
    setMessage(result.ok ? { type: 'success', text: 'Profile saved.' } : { type: 'error', text: result.error })
  }

  return (
    <DashboardLayout title="Profile" subtitle="Recruiters see these details when you apply.">
      <form className="card" onSubmit={submit} noValidate>
        {message && <Alert type={message.type}>{message.text}</Alert>}

        <div className="profile-photo">
          {form.avatar ? (
            <img src={form.avatar} alt="Profile" className="avatar-photo" />
          ) : (
            <span className="avatar avatar-lg">{initials(form.name)}</span>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()}>
              {form.avatar ? 'Change photo' : 'Upload photo'}
            </button>
            {form.avatar && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setForm((prev) => ({ ...prev, avatar: '' }))}
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onPhoto} tabIndex={-1} />
        </div>

        <div className="form-grid">
          {FIELDS.map(([name, label, type, placeholder]) => (
            <Field key={name} label={label} htmlFor={`p-${name}`} error={errors[name]}>
              <input
                id={`p-${name}`}
                type={type}
                className="input"
                placeholder={placeholder}
                value={form[name]}
                onChange={set(name)}
              />
            </Field>
          ))}
        </div>
        <Field label="Skills" htmlFor="p-skills" hint="Separate skills with commas, e.g. Java, React, SQL">
          <input id="p-skills" className="input" value={form.skills} onChange={set('skills')} />
        </Field>
        <Field label="About" htmlFor="p-about">
          <textarea id="p-about" className="input" rows={4} value={form.about} onChange={set('about')} />
        </Field>
        <button type="submit" className="btn btn-primary">
          Save Profile
        </button>
      </form>
    </DashboardLayout>
  )
}
