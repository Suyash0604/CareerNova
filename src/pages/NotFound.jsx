import { Compass } from 'lucide-react'
import { EmptyState } from '../components/Feedback'

export default function NotFound() {
  return (
    <div className="container section">
      <EmptyState
        icon={Compass}
        title="Page not found"
        message="The page you are looking for does not exist or has been moved."
        actionLabel="Back to Home"
        actionTo="/"
      />
    </div>
  )
}
