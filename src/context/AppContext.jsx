import { createContext, useContext, useRef, useState } from 'react'
import { loadAll, removeFromStorage, setToStorage } from '../utils/storage'
import { checkLogin, publicUser } from '../utils/auth'
import { TYPE_META, uid } from '../utils/helpers'

const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)

// Single source of truth for the app. State mirrors localStorage: every
// change goes through `update`, which writes the key and then re-renders.
export function AppProvider({ children }) {
  const [db, setDb] = useState(loadAll)
  const dbRef = useRef(db)

  const update = (key, updater) => {
    const next = typeof updater === 'function' ? updater(dbRef.current[key]) : updater
    if (!setToStorage(key, next)) return false
    dbRef.current = { ...dbRef.current, [key]: next }
    setDb(dbRef.current)
    return true
  }

  const current = () => dbRef.current.currentUser

  const notify = (userIds, message, link) => {
    const createdAt = new Date().toISOString()
    const items = [...new Set(userIds)]
      .filter(Boolean)
      .map((userId) => ({ id: uid('ntf'), userId, message, link, read: false, createdAt }))
    if (items.length) update('notifications', (list) => [...items, ...list])
  }

  // ---- Auth -------------------------------------------------------------

  const login = (credentials) => {
    const result = checkLogin(dbRef.current.users, credentials)
    if (!result.ok) return result
    update('currentUser', publicUser(result.user))
    return result
  }

  const logout = () => {
    removeFromStorage('currentUser')
    dbRef.current = { ...dbRef.current, currentUser: null }
    setDb(dbRef.current)
  }

  const register = (form) => {
    const base = {
      id: uid(form.role),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      phone: form.phone.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    let user = base
    if (form.role === 'student') {
      user = {
        ...base,
        college: form.college.trim(),
        degree: form.degree.trim(),
        branch: form.branch.trim(),
        graduationYear: form.graduationYear,
        skills: [],
        linkedin: '',
        github: '',
        about: '',
      }
    }
    if (form.role === 'recruiter') {
      const companyName = form.companyName.trim()
      let company = dbRef.current.companies.find((c) => c.name.toLowerCase() === companyName.toLowerCase())
      if (!company) {
        company = {
          id: uid('c'),
          name: companyName,
          industry: '',
          location: '',
          size: '',
          website: '',
          description: '',
          about: '',
        }
        update('companies', (list) => [...list, company])
      }
      user = { ...base, companyId: company.id, companyName: company.name, designation: form.designation.trim() }
    }
    update('users', (list) => [...list, user])
    return user
  }

  const updateProfile = (patch) => {
    const user = current()
    if (patch.email) {
      const email = patch.email.trim().toLowerCase()
      if (dbRef.current.users.some((u) => u.id !== user.id && u.email.toLowerCase() === email)) {
        return { ok: false, error: 'Another account already uses this email.' }
      }
      patch = { ...patch, email }
    }
    const saved = update('users', (list) => list.map((u) => (u.id === user.id ? { ...u, ...patch } : u)))
    if (!saved || !update('currentUser', { ...user, ...patch })) {
      return { ok: false, error: 'Could not save your profile. Browser storage may be full.' }
    }
    return { ok: true }
  }

  // ---- Saved opportunities ----------------------------------------------

  const isSaved = (type, id) => {
    const user = db.currentUser
    return Boolean(user && db[TYPE_META[type].savedKey][user.id]?.includes(id))
  }

  const toggleSaved = (type, id) => {
    const user = current()
    if (!user) return
    update(TYPE_META[type].savedKey, (map) => {
      const ids = map[user.id] || []
      return { ...map, [user.id]: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] }
    })
  }

  // ---- Resume -----------------------------------------------------------

  const saveResume = (resume) => update('resumes', (map) => ({ ...map, [current().id]: resume }))

  const removeResume = () =>
    update('resumes', (map) => {
      const { [current().id]: _removed, ...rest } = map
      return rest
    })

  // ---- Applications -----------------------------------------------------

  const hasApplied = (type, id) => {
    const user = db.currentUser
    return Boolean(
      user &&
        db.applications.some((a) => a.userId === user.id && a.opportunityType === type && a.opportunityId === id),
    )
  }

  const applyTo = (type, item, form) => {
    const user = current()
    if (!user) return { ok: false, error: 'Please log in to apply.' }
    const { applications, resumes } = dbRef.current
    if (applications.some((a) => a.userId === user.id && a.opportunityType === type && a.opportunityId === item.id)) {
      return { ok: false, error: 'You have already applied to this opportunity.' }
    }
    const resume = resumes[user.id]
    if (!resume) return { ok: false, error: 'Please upload your resume before applying.' }

    const application = {
      id: uid('app'),
      userId: user.id,
      opportunityId: item.id,
      opportunityType: type,
      company: item.company,
      companyId: item.companyId ?? null,
      recruiterId: item.postedBy ?? null,
      title: item.title,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      coverMessage: form.coverMessage.trim(),
      resumeName: resume.fileName,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
    }
    if (!update('applications', (list) => [application, ...list])) {
      return { ok: false, error: 'Could not save your application. Browser storage may be full.' }
    }
    notify(
      [user.id],
      `Your application for ${item.title} at ${item.company} has been submitted.`,
      '/student/applications',
    )
    notify([item.postedBy], `${application.name} applied for ${item.title}.`, '/recruiter/applicants')
    return { ok: true }
  }

  const setApplicationStatus = (id, status) => {
    const application = dbRef.current.applications.find((a) => a.id === id)
    if (!application || application.status === status) return
    update('applications', (list) => list.map((a) => (a.id === id ? { ...a, status } : a)))
    notify(
      [application.userId],
      `Your application for ${application.title} at ${application.company} is now "${status}".`,
      '/student/applications',
    )
  }

  // ---- Opportunities (jobs / internships) --------------------------------

  const saveOpportunity = (type, data, id) => {
    const meta = TYPE_META[type]
    if (id) {
      update(meta.key, (list) => list.map((item) => (item.id === id ? { ...item, ...data } : item)))
      return id
    }
    const user = current()
    const item = {
      ...data,
      id: uid(type),
      postedBy: user.id,
      companyId: user.companyId ?? null,
      postedAt: new Date().toISOString().slice(0, 10),
    }
    update(meta.key, (list) => [item, ...list])
    notify(
      dbRef.current.users.filter((u) => u.role === 'student').map((u) => u.id),
      `New ${meta.label.toLowerCase()} posted: ${item.title} at ${item.company}.`,
      `${meta.path}/${item.id}`,
    )
    return item.id
  }

  const updateCompany = (id, patch) => {
    const name = patch.name?.trim()
    update('companies', (list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    if (!name) return
    // Keep the denormalised company name in sync everywhere it is shown.
    const rename = (list) => list.map((item) => (item.companyId === id ? { ...item, company: name } : item))
    ;['jobs', 'internships', 'placements', 'applications'].forEach((key) => update(key, rename))
    update('users', (list) => list.map((u) => (u.companyId === id ? { ...u, companyName: name } : u)))
    const user = current()
    if (user?.companyId === id) update('currentUser', { ...user, companyName: name })
  }

  // Generic removal used by the recruiter and admin screens.
  const deleteRecord = (key, id) => {
    update(key, (list) => list.filter((record) => record.id !== id))
    if (key === 'users') {
      update('applications', (list) => list.filter((a) => a.userId !== id))
      update('notifications', (list) => list.filter((n) => n.userId !== id))
      update('resumes', ({ [id]: _removed, ...rest }) => rest)
    }
  }

  // ---- Notifications ----------------------------------------------------

  const myNotifications = db.currentUser ? db.notifications.filter((n) => n.userId === db.currentUser.id) : []

  const markNotificationRead = (id) =>
    update('notifications', (list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const markAllNotificationsRead = () =>
    update('notifications', (list) => list.map((n) => (n.userId === current().id ? { ...n, read: true } : n)))

  const clearNotification = (id) => update('notifications', (list) => list.filter((n) => n.id !== id))

  const clearAllNotifications = () =>
    update('notifications', (list) => list.filter((n) => n.userId !== current().id))

  // ---- Contact ----------------------------------------------------------

  const addContactMessage = (message) =>
    update('contactMessages', (list) => [
      { ...message, id: uid('msg'), submittedAt: new Date().toISOString() },
      ...list,
    ])

  const value = {
    ...db,
    resume: db.currentUser ? db.resumes[db.currentUser.id] || null : null,
    myNotifications,
    login,
    logout,
    register,
    updateProfile,
    isSaved,
    toggleSaved,
    saveResume,
    removeResume,
    hasApplied,
    applyTo,
    setApplicationStatus,
    saveOpportunity,
    updateCompany,
    deleteRecord,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
    addContactMessage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
