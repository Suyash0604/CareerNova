// CareerNova mark: an "N" whose right stroke ends in a four-point "nova" spark.
export default function Logo({ size = 36, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" {...props}>
      <rect width="64" height="64" rx="15" fill="#2563EB" />
      <path
        d="M19 47V19l26 28V30"
        fill="none"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M45 8.5c.9 5.6 2.9 7.6 8.5 8.5-5.6.9-7.6 2.9-8.5 8.5-.9-5.6-2.9-7.6-8.5-8.5 5.6-.9 7.6-2.9 8.5-8.5Z" fill="#fff" />
    </svg>
  )
}
