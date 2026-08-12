export function ReportsSkeleton() {
  return (
    <div className="report-grid" aria-label="Loading available reports" aria-busy="true">
      {[0, 1, 2].map((item) => (
        <div className="report-card report-card--skeleton" key={item} data-testid="report-skeleton">
          <span className="skeleton skeleton--icon" />
          <span className="skeleton skeleton--title" />
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line skeleton--line-short" />
          <span className="skeleton skeleton--footer" />
        </div>
      ))}
      <span className="sr-only" role="status">Loading reports</span>
    </div>
  )
}
