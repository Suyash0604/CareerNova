// Frontend-only demo authentication. There is no server: users live in
// localStorage and "logging in" just stores the matching user as currentUser.

export const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
]

export const dashboardPath = (role) =>
  ({ student: '/student/dashboard', recruiter: '/recruiter/dashboard', admin: '/admin/dashboard' })[role] || '/'

export const publicUser = ({ password, ...rest }) => rest

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
export const isPhone = (value) => /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, '').replace(/^\+91/, ''))

export function checkLogin(users, { email, password, role }) {
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || user.password !== password) return { ok: false, error: 'Incorrect email or password.' }
  if (user.role !== role) {
    return { ok: false, error: `This account is not registered as ${role === 'admin' ? 'an' : 'a'} ${role}.` }
  }
  return { ok: true, user }
}

export function validateRegistration(form, users) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!isEmail(form.email)) errors.email = 'Enter a valid email address.'
  else if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
    errors.email = 'An account with this email already exists.'
  }
  if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
  if (!isPhone(form.phone)) errors.phone = 'Enter a valid 10-digit mobile number.'

  if (form.role === 'student') {
    if (!form.college.trim()) errors.college = 'College is required.'
    if (!form.degree.trim()) errors.degree = 'Degree is required.'
    if (!form.branch.trim()) errors.branch = 'Branch is required.'
    if (!/^20\d{2}$/.test(form.graduationYear)) errors.graduationYear = 'Enter a valid year, e.g. 2027.'
  }
  if (form.role === 'recruiter') {
    if (!form.companyName.trim()) errors.companyName = 'Company name is required.'
    if (!form.designation.trim()) errors.designation = 'Designation is required.'
  }
  return errors
}
