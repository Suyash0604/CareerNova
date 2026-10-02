import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import FilterSidebar from './FilterSidebar'
import OpportunityCard from './OpportunityCard'
import PageHeader from './PageHeader'
import Pagination from './Pagination'
import { EmptyState } from './Feedback'
import { useApp } from '../context/AppContext'
import {
  EXPERIENCE_LEVELS,
  INTERNSHIP_TYPES,
  JOB_TYPES,
  TYPE_META,
  WORK_MODES,
  applyFilters,
  uniqueValues,
} from '../utils/helpers'

const PAGE_SIZE = 6

const amountOptions = (amounts, format) => amounts.map((value) => ({ value: String(value), label: format(value) }))

const CONFIG = {
  job: {
    subtitle: 'Full-time, part-time and contract roles for students and recent graduates.',
    placeholder: 'Title, company or skill',
    fields: (items) => [
      { name: 'location', label: 'Location', type: 'select', options: uniqueValues(items, 'location') },
      { name: 'jobType', label: 'Job type', type: 'select', options: JOB_TYPES },
      { name: 'experience', label: 'Experience', type: 'select', options: EXPERIENCE_LEVELS },
      {
        name: 'salary',
        label: 'Salary',
        type: 'select',
        amount: true,
        options: amountOptions([5, 8, 10], (value) => `₹${value} LPA and above`),
      },
    ],
  },
  internship: {
    subtitle: 'Short-term and semester-long internships across engineering, analytics, design and marketing.',
    placeholder: 'Title, company or skill',
    fields: (items) => [
      { name: 'location', label: 'Location', type: 'select', options: uniqueValues(items, 'location') },
      { name: 'internshipType', label: 'Internship type', type: 'select', options: INTERNSHIP_TYPES },
      { name: 'workMode', label: 'Work mode', type: 'select', options: WORK_MODES },
      {
        name: 'stipend',
        label: 'Stipend',
        type: 'select',
        amount: true,
        options: amountOptions([10000, 15000, 25000], (value) => `₹${value.toLocaleString('en-IN')} and above`),
      },
      { name: 'duration', label: 'Duration', type: 'select', options: uniqueValues(items, 'duration') },
    ],
  },
}

// Listing page shared by /jobs and /internships.
export default function OpportunityList({ type }) {
  const data = useApp()
  const meta = TYPE_META[type]
  const config = CONFIG[type]
  const items = data[meta.key]
  const [params] = useSearchParams()
  const [values, setValues] = useState({ q: params.get('q') || '', location: params.get('location') || '' })
  const [page, setPage] = useState(1)

  const fields = useMemo(
    () => [{ name: 'q', label: 'Search', type: 'search', placeholder: config.placeholder }, ...config.fields(items)],
    [config, items],
  )
  const results = useMemo(() => applyFilters(items, fields, values), [items, fields, values])
  const pageCount = Math.ceil(results.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(pageCount, 1))
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const onChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }
  const onClear = () => {
    setValues({})
    setPage(1)
  }

  return (
    <>
      <PageHeader title={meta.plural} subtitle={config.subtitle} />
      <div className="container list-layout">
        <FilterSidebar fields={fields} values={values} onChange={onChange} onClear={onClear} />
        <div>
          <p className="results-bar muted">
            {results.length} {results.length === 1 ? meta.label.toLowerCase() : meta.plural.toLowerCase()} found
          </p>
          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={`No ${meta.plural.toLowerCase()} match your search`}
              message="Try a different keyword or remove some filters."
            >
              <button type="button" className="btn btn-primary" onClick={onClear}>
                Clear Filters
              </button>
            </EmptyState>
          ) : (
            <div className="stack">
              {visible.map((item) => (
                <OpportunityCard key={item.id} type={type} item={item} />
              ))}
            </div>
          )}
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>
    </>
  )
}
