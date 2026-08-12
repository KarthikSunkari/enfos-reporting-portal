import { Link, useParams } from 'react-router'
import { BrandMark } from '../../../components/BrandMark'
import { ArrowLeftIcon } from '../../../components/Icons'
import { ReportDataTable } from '../components/ReportDataTable'
import {
  ReportTableEmpty,
  ReportTableError,
  ReportTableSkeleton,
} from '../components/ReportTableStates'
import { useReportRows } from '../hooks/useReportRows'
import { getReportDefinition } from '../reportDefinitions'

export function ReportDetailPage() {
  const { reportId } = useParams()
  const definition = getReportDefinition(reportId)
  const { rows, isLoading, error, retry } = useReportRows(definition)

  if (!definition) {
    return (
      <div className="unknown-report">
        <BrandMark />
        <main>
          <p className="eyebrow"><span /> Unknown report</p>
          <h1>That report doesn’t exist.</h1>
          <p>The report link may be outdated, or the report may no longer be available.</p>
          <Link className="button button--primary" to="/">
            <ArrowLeftIcon />
            Back to Reports
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <header className="site-header detail-header">
        <Link className="brand-link" to="/" aria-label="ENFOS reporting home">
          <BrandMark />
        </Link>
        <div className="workspace-label">
          <span className="workspace-label__dot" aria-hidden="true" />
          Reporting workspace
        </div>
      </header>

      <main id="main-content">
        <section className="detail-hero" aria-labelledby="report-title">
          <div className="detail-hero__inner">
            <Link className="back-link" to="/">
              <ArrowLeftIcon />
              Back to Reports
            </Link>
            <div className="detail-hero__title-row">
              <div>
                <p className="eyebrow"><span /> {definition.category}</p>
                <h1 id="report-title">{definition.name}</h1>
                <p>{definition.description}</p>
              </div>
              <dl className="detail-hero__summary">
                <div>
                  <dt>Records</dt>
                  <dd>{isLoading ? '—' : rows.length.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>Live API</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div className="detail-content">
          {isLoading && <ReportTableSkeleton />}
          {!isLoading && error && <ReportTableError message={error} onRetry={retry} />}
          {!isLoading && !error && rows.length === 0 && <ReportTableEmpty />}
          {!isLoading && !error && rows.length > 0 && (
            <ReportDataTable definition={definition} rows={rows} />
          )}
        </div>
      </main>

      <footer className="site-footer">
        <BrandMark />
        <p>Environmental information, clearly connected.</p>
        <p>Internal reporting portal</p>
      </footer>
    </div>
  )
}
