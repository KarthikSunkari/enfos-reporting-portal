import { useMemo, useState } from 'react'
import { BrandMark } from '../../../components/BrandMark'
import { SearchIcon } from '../../../components/Icons'
import { ReportCard } from '../components/ReportCard'
import { ReportsSkeleton } from '../components/ReportsSkeleton'
import {
  ReportsEmptyState,
  ReportsErrorState,
  ReportsNoResultsState,
} from '../components/ReportsState'
import { useReports } from '../hooks/useReports'

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function ReportsLandingPage() {
  const { reports, isLoading, error, retry } = useReports()
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase()

  const filteredReports = useMemo(
    () => reports.filter((report) => report.name.toLocaleLowerCase().includes(normalizedQuery)),
    [normalizedQuery, reports],
  )

  const totalRecords = useMemo(
    () => reports.reduce((total, report) => total + report.rowCount, 0),
    [reports],
  )

  const latestUpdate = useMemo(() => {
    const timestamps = reports
      .map((report) => new Date(report.lastUpdated).getTime())
      .filter(Number.isFinite)
    if (timestamps.length === 0) return 'Awaiting data'
    return timeFormatter.format(new Date(Math.max(...timestamps)))
  }, [reports])

  const resultLabel = normalizedQuery
    ? `${filteredReports.length} ${filteredReports.length === 1 ? 'match' : 'matches'}`
    : `${reports.length} ${reports.length === 1 ? 'report' : 'reports'}`

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand-link" href="#main-content">
          <BrandMark />
        </a>
        <div className="workspace-label">
          <span className="workspace-label__dot" aria-hidden="true" />
          Reporting workspace
        </div>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero__copy">
            <p className="eyebrow"><span /> Operational intelligence</p>
            <h1 id="page-title">Reports that move<br />work forward.</h1>
            <p className="hero__description">
              A clear view of your people, organization, and project delivery—ready when decisions need to be made.
            </p>
          </div>

          <dl className="hero__metrics" aria-label="Reporting overview">
            <div>
              <dt>Available reports</dt>
              <dd>{isLoading ? '—' : reports.length.toString().padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Visible records</dt>
              <dd>{isLoading ? '—' : totalRecords.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Latest refresh</dt>
              <dd className="hero__metric-date">{isLoading ? 'Checking…' : latestUpdate}</dd>
            </div>
          </dl>
        </section>

        <section className="reports-section" aria-labelledby="reports-heading">
          <div className="reports-toolbar">
            <div>
              <p className="section-index">01 / REPORT LIBRARY</p>
              <h2 id="reports-heading">Available reports</h2>
              <p>Choose a report to explore the latest operational data.</p>
            </div>

            <label className="search-field">
              <span className="sr-only">Search reports by name</span>
              <SearchIcon />
              <input
                type="search"
                aria-label="Search reports by name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reports"
                autoComplete="off"
              />
              {!isLoading && !error && <span className="search-field__count" aria-live="polite">{resultLabel}</span>}
            </label>
          </div>

          {isLoading && <ReportsSkeleton />}
          {!isLoading && error && <ReportsErrorState message={error} onRetry={retry} />}
          {!isLoading && !error && reports.length === 0 && <ReportsEmptyState />}
          {!isLoading && !error && reports.length > 0 && filteredReports.length === 0 && (
            <ReportsNoResultsState query={query.trim()} onClear={() => setQuery('')} />
          )}
          {!isLoading && !error && filteredReports.length > 0 && (
            <div className="report-grid">
              {filteredReports.map((report, index) => (
                <ReportCard report={report} index={index} key={report.id} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <BrandMark />
        <p>Environmental information, clearly connected.</p>
        <p>Internal reporting portal</p>
      </footer>
    </div>
  )
}
