import { useLocation, useNavigate } from 'react-router-dom'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Save / Saved toggle for jobs and internships. Logged-out visitors are sent
// to login; recruiters and admins have no saved list, so nothing is shown.
export default function SaveButton({ type, id, block = false }) {
  const { currentUser, isSaved, toggleSaved } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  if (currentUser && currentUser.role !== 'student') return null

  const saved = isSaved(type, id)
  const onClick = () => {
    if (!currentUser) navigate('/login', { state: { from: location.pathname + location.search } })
    else toggleSaved(type, id)
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${saved ? 'btn-saved' : 'btn-outline'} ${block ? 'btn-block' : ''}`}
      onClick={onClick}
      aria-pressed={saved}
    >
      {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
