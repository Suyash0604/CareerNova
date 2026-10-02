export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}
