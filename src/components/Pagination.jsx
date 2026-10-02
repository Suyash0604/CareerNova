import { ChevronLeft, ChevronRight } from 'lucide-react'

// Renders nothing when everything fits on one page.
export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <span className="muted small">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  )
}
