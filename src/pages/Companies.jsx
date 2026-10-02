import { useState } from 'react'
import { Search, SearchX } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'
import PageHeader from '../components/PageHeader'
import { EmptyState } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { matchesSearch } from '../utils/helpers'

export default function Companies() {
  const { companies } = useApp()
  const [query, setQuery] = useState('')
  const results = query ? companies.filter((company) => matchesSearch(company, query)) : companies

  return (
    <>
      <PageHeader title="Companies" subtitle="Organisations currently hiring through CareerNova.">
        <label className="inline-search">
          <Search size={16} />
          <span className="sr-only">Search companies</span>
          <input
            type="search"
            placeholder="Search by name, industry or city"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </PageHeader>
      <div className="container section section-tight">
        {results.length === 0 ? (
          <EmptyState icon={SearchX} title="No companies found" message="Try a different name, industry or city.">
            <button type="button" className="btn btn-primary" onClick={() => setQuery('')}>
              Clear Search
            </button>
          </EmptyState>
        ) : (
          <div className="grid grid-2">
            {results.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
