import { AlertIcon, DatabaseIcon, RefreshIcon, SearchIcon } from '../../../components/Icons'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ReportsErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="content-state content-state--error" role="alert">
      <span className="content-state__icon"><AlertIcon /></span>
      <div>
        <p className="content-state__eyebrow">Connection interrupted</p>
        <h3>Reports are temporarily unavailable</h3>
        <p>{message}</p>
      </div>
      <button className="button button--primary" type="button" onClick={onRetry}>
        <RefreshIcon />
        Try again
      </button>
    </div>
  )
}

export function ReportsEmptyState() {
  return (
    <div className="content-state">
      <span className="content-state__icon"><DatabaseIcon /></span>
      <div>
        <p className="content-state__eyebrow">Workspace ready</p>
        <h3>No reports are available yet</h3>
        <p>Reports will appear here as soon as they are published.</p>
      </div>
    </div>
  )
}

interface NoResultsStateProps {
  query: string
  onClear: () => void
}

export function ReportsNoResultsState({ query, onClear }: NoResultsStateProps) {
  return (
    <div className="content-state">
      <span className="content-state__icon"><SearchIcon /></span>
      <div>
        <p className="content-state__eyebrow">No matches</p>
        <h3>No reports found for “{query}”</h3>
        <p>Try a different report name or reset your search.</p>
      </div>
      <button className="button button--secondary" type="button" onClick={onClear}>
        Clear search
      </button>
    </div>
  )
}
