import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'
import JobCard from '../components/JobCard'
import InternshipCard from '../components/InternshipCard'
import PageHeader from '../components/PageHeader'
import PlacementCard from '../components/PlacementCard'
import SearchBar from '../components/SearchBar'
import { EmptyState } from '../components/Feedback'
import { useApp } from '../context/AppContext'
import { matchesSearch } from '../utils/helpers'

function ResultGroup({ title, items, render }) {
  if (items.length === 0) return null
  return (
    <section className="dash-section">
      <div className="section-head">
        <h2>
          {title} ({items.length})
        </h2>
      </div>
      <div className="grid grid-2">{items.map(render)}</div>
    </section>
  )
}

// Results for the site-wide search on the home page.
export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const location = params.get('location') || ''
  const { jobs, internships, placements, companies } = useApp()

  const filter = (items) =>
    items.filter((item) => (!query || matchesSearch(item, query)) && (!location || item.location === location))

  const found = {
    jobs: filter(jobs),
    internships: filter(internships),
    placements: filter(placements),
    companies: filter(companies),
  }
  const total = Object.values(found).reduce((sum, list) => sum + list.length, 0)

  return (
    <>
      <PageHeader
        title="Search results"
        subtitle={`${total} ${total === 1 ? 'result' : 'results'}${query ? ` for "${query}"` : ''}${location ? ` in ${location}` : ''}`}
      >
        <SearchBar key={`${query}|${location}`} initialQuery={query} initialLocation={location} />
      </PageHeader>
      <div className="container section section-tight">
        {total === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No results found"
            message="Try a different keyword or location."
            actionLabel="Browse all jobs"
            actionTo="/jobs"
          />
        ) : (
          <>
            <ResultGroup title="Jobs" items={found.jobs} render={(job) => <JobCard key={job.id} job={job} />} />
            <ResultGroup
              title="Internships"
              items={found.internships}
              render={(item) => <InternshipCard key={item.id} internship={item} />}
            />
            <ResultGroup
              title="Placement Drives"
              items={found.placements}
              render={(drive) => <PlacementCard key={drive.id} drive={drive} />}
            />
            <ResultGroup
              title="Companies"
              items={found.companies}
              render={(company) => <CompanyCard key={company.id} company={company} />}
            />
          </>
        )}
      </div>
    </>
  )
}
