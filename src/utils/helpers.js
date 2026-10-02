export const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected']
export const PENDING_STATUSES = ['Applied', 'Under Review']

export const LOCATIONS = ['Pune', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi', 'Chennai', 'Noida', 'Remote']
export const JOB_TYPES = ['Full Time', 'Part Time', 'Contract']
export const EXPERIENCE_LEVELS = ['Fresher', '0–1 years', '1–3 years', '3+ years']
export const INTERNSHIP_TYPES = ['Full Time', 'Part Time']
export const WORK_MODES = ['On-site', 'Hybrid', 'Remote']

export const TYPE_META = {
  job: { key: 'jobs', savedKey: 'savedJobs', label: 'Job', plural: 'Jobs', path: '/jobs' },
  internship: {
    key: 'internships',
    savedKey: 'savedInternships',
    label: 'Internship',
    plural: 'Internships',
    path: '/internships',
  },
  placement: { key: 'placements', label: 'Placement Drive', plural: 'Placement Drives', path: '/placements' },
}

export const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx']
export const MAX_RESUME_BYTES = 2 * 1024 * 1024
export const MAX_AVATAR_BYTES = 300 * 1024

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10)

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function postedAgo(value) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  if (Number.isNaN(days)) return ''
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  return `on ${formatDate(value)}`
}

export const isPast = (date) => Boolean(date) && new Date(`${String(date).slice(0, 10)}T23:59:59`) < new Date()

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('') || '?'

// Largest number in a free-text amount: "₹6 – 9 LPA" → 9, "₹15,000 / month" → 15000.
export function maxAmount(text) {
  const numbers = String(text || '')
    .replace(/,/g, '')
    .match(/\d+(\.\d+)?/g)
  return numbers ? Math.max(...numbers.map(Number)) : 0
}

export const toLines = (text = '') =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

export const toSkills = (text = '') =>
  text
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

export const uniqueValues = (items, field) =>
  [...new Set(items.flatMap((item) => item[field]).filter(Boolean))].sort()

export function matchesSearch(item, query) {
  const haystack = [item.title, item.name, item.company, item.role, item.industry, item.location, ...(item.skills || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

// Filter fields are the same objects FilterSidebar renders:
// { name, type: 'search' | 'select', amount?: true }
export function applyFilters(items, fields, values) {
  return items.filter((item) =>
    fields.every((field) => {
      const value = values[field.name]
      if (!value) return true
      if (field.type === 'search') return matchesSearch(item, value)
      if (field.amount) return maxAmount(item[field.name]) >= Number(value)
      const itemValue = item[field.name]
      return Array.isArray(itemValue) ? itemValue.includes(value) : itemValue === value
    }),
  )
}

export const fileExtension = (fileName = '') => fileName.split('.').pop().toLowerCase()

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// Opens a stored file in a new tab when the browser can display it (PDF),
// otherwise downloads it (DOC/DOCX).
export function openStoredFile({ dataUrl, fileName }) {
  const [head, body] = dataUrl.split(',')
  const mime = head.match(/data:(.*?);/)?.[1] || 'application/octet-stream'
  const bytes = Uint8Array.from(atob(body), (char) => char.charCodeAt(0))
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }))
  if (mime === 'application/pdf') {
    window.open(url, '_blank', 'noopener')
  } else {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
