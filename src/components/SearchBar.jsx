import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { LOCATIONS } from '../utils/helpers'

// Site-wide search. Results are shown on /search.
export default function SearchBar({ initialQuery = '', initialLocation = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (location) params.set('location', location)
    navigate(`/search?${params}`)
  }

  return (
    <form className="searchbar" onSubmit={onSubmit} role="search">
      <label className="searchbar-field">
        <Search size={17} />
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search jobs, internships, companies..."
        />
      </label>
      <label className="searchbar-field searchbar-location">
        <MapPin size={17} />
        <span className="sr-only">Location</span>
        <select value={location} onChange={(event) => setLocation(event.target.value)}>
          <option value="">All locations</option>
          {LOCATIONS.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-primary">
        Search Opportunities
      </button>
    </form>
  )
}
