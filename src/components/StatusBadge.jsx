const TONES = {
  Applied: 'blue',
  'Under Review': 'amber',
  Shortlisted: 'purple',
  Interview: 'teal',
  Rejected: 'red',
  Selected: 'green',
  // Placement drive statuses
  Open: 'green',
  Upcoming: 'blue',
  Closed: 'gray',
}

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${TONES[status] || 'gray'}`}>{status}</span>
}
