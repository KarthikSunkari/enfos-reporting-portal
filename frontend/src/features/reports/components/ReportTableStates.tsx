import { AlertIcon, DatabaseIcon, RefreshIcon } from '../../../components/Icons'

export function ReportTableSkeleton() {
  return (
    <div className="data-panel data-panel--loading" aria-busy="true">
      <div className="table-loading-heading">
        <span className="skeleton skeleton--table-title" />
        <span className="skeleton skeleton--table-search" />
      </div>
      <div className="table-loading-grid">
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <span className="skeleton skeleton--table-row" key={row} />
        ))}
      </div>
      <span className="sr-only" role="status">Loading report data</span>
    </div>
  )
}

interface ReportTableErrorProps {
  message: string
  onRetry: () => void
}

export function ReportTableError({ message, onRetry }: ReportTableErrorProps) {
  return (
    <div className="detail-state detail-state--error" role="alert">
      <span className="content-state__icon"><AlertIcon /></span>
      <div>
        <p className="content-state__eyebrow">Connection interrupted</p>
        <h2>Report data is temporarily unavailable</h2>
        <p>{message}</p>
      </div>
      <button className="button button--primary" type="button" onClick={onRetry}>
        <RefreshIcon />
        Try again
      </button>
    </div>
  )
}

export function ReportTableEmpty() {
  return (
    <div className="detail-state">
      <span className="content-state__icon"><DatabaseIcon /></span>
      <div>
        <p className="content-state__eyebrow">No report rows</p>
        <h2>This report is ready for its first records</h2>
        <p>Data will appear here as soon as records are published.</p>
      </div>
    </div>
  )
}
