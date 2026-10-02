import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

// fields: [{ name, label, type: 'search' | 'select', options, placeholder }]
// options are strings or { value, label }. Collapsible on small screens.
export default function FilterSidebar({ fields, values, onChange, onClear }) {
  const [open, setOpen] = useState(false)
  const activeCount = fields.filter((field) => values[field.name]).length

  return (
    <aside className="filters card">
      <div className="filters-head">
        <h2>
          <SlidersHorizontal size={16} /> Filters
        </h2>
        <button
          type="button"
          className="btn btn-outline btn-sm filters-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Hide' : 'Show'}
          {activeCount > 0 && ` (${activeCount})`}
        </button>
      </div>
      <div className={`filters-body ${open ? 'open' : ''}`}>
        {fields.map((field) => {
          const id = `filter-${field.name}`
          return (
            <div className="field" key={field.name}>
              <label htmlFor={id}>{field.label}</label>
              {field.type === 'search' ? (
                <input
                  id={id}
                  type="search"
                  className="input"
                  placeholder={field.placeholder}
                  value={values[field.name] || ''}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              ) : (
                <select
                  id={id}
                  className="input"
                  value={values[field.name] || ''}
                  onChange={(event) => onChange(field.name, event.target.value)}
                >
                  <option value="">All</option>
                  {field.options.map((option) => {
                    const { value, label } = typeof option === 'string' ? { value: option, label: option } : option
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  })}
                </select>
              )}
            </div>
          )
        })}
        <button type="button" className="btn btn-outline btn-block" onClick={onClear} disabled={activeCount === 0}>
          Clear Filters
        </button>
      </div>
    </aside>
  )
}
