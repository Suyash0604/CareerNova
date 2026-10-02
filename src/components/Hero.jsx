import SearchBar from './SearchBar'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=70'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="eyebrow">Student Career Portal</p>
          <h1>Find the right opportunity for your career.</h1>
          <p className="hero-lead">
            CareerNova helps students discover jobs, internships and campus placement drives in one place — and
            keep track of every application from submission to result.
          </p>
          <SearchBar />
        </div>
        <div className="hero-media">
          <img
            src={HERO_IMAGE}
            alt="Students working together on a university campus"
            onError={(event) => {
              event.currentTarget.parentElement.style.display = 'none'
            }}
          />
        </div>
      </div>
    </section>
  )
}
