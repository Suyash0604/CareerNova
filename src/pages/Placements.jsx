import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import FilterSidebar from '../components/FilterSidebar'
import PageHeader from '../components/PageHeader'
import PlacementCard from '../components/PlacementCard'
import { EmptyState } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { applyFilters, uniqueValues } from '../utils/helpers'

export default function Placements() {
  const { placements } = useApp()
  const [values, setValues] = useState({})

  const fields = useMemo(
    () => [
      { name: 'q', label: 'Search', type: 'search', placeholder: 'Drive or company' },
      { name: 'company', label: 'Company', type: 'select', options: uniqueValues(placements, 'company') },
      { name: 'location', label: 'Location', type: 'select', options: uniqueValues(placements, 'location') },
      { name: 'degrees', label: 'Degree', type: 'select', options: uniqueValues(placements, 'degrees') },
      { name: 'branches', label: 'Branch', type: 'select', options: uniqueValues(placements, 'branches') },
      { name: 'status', label: 'Status', type: 'select', options: ['Open', 'Upcoming', 'Closed'] },
    ],
    [placements],
  )
  const results = useMemo(() => applyFilters(placements, fields, values), [placements, fields, values])
  const onClear = () => setValues({})

  return (
    <>
      <PageHeader
        title="Placement Drives"
        subtitle="Campus and off-campus hiring drives. Check eligibility and register before the deadline."
      />
      <div className="container list-layout">
        <FilterSidebar
          fields={fields}
          values={values}
          onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
          onClear={onClear}
        />
        <div>
          <p className="results-bar muted">
            {results.length} {results.length === 1 ? 'drive' : 'drives'} found
          </p>
          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No placement drives match your filters"
              message="Try removing some filters to see more drives."
            >
              <button type="button" className="btn btn-primary" onClick={onClear}>
                Clear Filters
              </button>
            </EmptyState>
          ) : (
            <div className="stack">
              {results.map((drive) => (
                <PlacementCard key={drive.id} drive={drive} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
