import { Link, useParams } from 'react-router'
import { BrandMark } from '../../../components/BrandMark'

export function ReportComingSoonPage() {
  const { reportId = 'report' } = useParams()
  const reportName = reportId.charAt(0).toUpperCase() + reportId.slice(1)

  return (
    <div className="detail-placeholder">
      <header className="site-header">
        <BrandMark />
        <div className="workspace-label">
          <span className="workspace-label__dot" aria-hidden="true" />
          Reporting workspace
        </div>
      </header>
      <main>
        <p className="eyebrow"><span /> Report selected</p>
        <h1>{reportName}</h1>
        <p>The interactive table for this report arrives in the next delivery phase.</p>
        <Link className="button button--primary" to="/">Back to all reports</Link>
      </main>
    </div>
  )
}
