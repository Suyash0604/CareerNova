import { jobs } from '../data/jobs'
import { internships } from '../data/internships'
import { companies } from '../data/companies'
import { placements } from '../data/placements'
import { users } from '../data/users'

// Every key the app persists. Defaults are written only when a key is missing,
// so existing data is never overwritten on load.
const DEFAULTS = {
  users,
  jobs,
  internships,
  companies,
  placements,
  applications: [],
  savedJobs: {}, // { [userId]: [jobId, ...] }
  savedInternships: {}, // { [userId]: [internshipId, ...] }
  notifications: [],
  contactMessages: [],
  resumes: {}, // { [userId]: { fileName, fileType, uploadedAt, dataUrl } }
}

export function getFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

// Returns false when the write fails (e.g. the browser storage quota is full).
export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // nothing to remove
  }
}

export function initializeStorage() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    if (getFromStorage(key) === null) setToStorage(key, value)
  })
}

export function loadAll() {
  initializeStorage()
  const db = { currentUser: getFromStorage('currentUser', null) }
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    db[key] = getFromStorage(key, value)
  })
  return db
}
