import type { ComponentType, CSSProperties, SVGProps } from 'react'
import { Link } from 'react-router'
import {
  ArrowUpRightIcon,
  DepartmentsIcon,
  ProjectsIcon,
  UsersIcon,
} from '../../../components/Icons'
import type { ReportSummary } from '../types/report'

interface ReportCardProps {
  report: ReportSummary
  index: number
}

interface ReportPresentation {
  category: string
  color: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

const presentationById: Record<string, ReportPresentation> = {
  users: { category: 'People & access', color: 'cyan', Icon: UsersIcon },
  departments: { category: 'Organization', color: 'violet', Icon: DepartmentsIcon },
  projects: { category: 'Delivery', color: 'amber', Icon: ProjectsIcon },
}

const fallbackPresentation: ReportPresentation = {
  category: 'Operational report',
  color: 'cyan',
  Icon: ProjectsIcon,
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function ReportCard({ report, index }: ReportCardProps) {
  const presentation = presentationById[report.id] ?? fallbackPresentation
  const { Icon } = presentation
  const updatedDate = new Date(report.lastUpdated)
  const formattedDate = Number.isNaN(updatedDate.getTime())
    ? 'Recently'
    : dateFormatter.format(updatedDate)

  return (
    <article
      className={`report-card report-card--${presentation.color}`}
      style={{ '--card-delay': `${index * 70}ms` } as CSSProperties}
    >
      <div className="report-card__topline">
        <span className="report-card__icon" aria-hidden="true">
          <Icon />
        </span>
        <span className="report-card__category">{presentation.category}</span>
      </div>

      <div className="report-card__content">
        <h3>{report.name}</h3>
        <p>{report.description}</p>
      </div>

      <dl className="report-card__metadata">
        <div>
          <dt>Records</dt>
          <dd>{report.rowCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Data updated</dt>
          <dd>{formattedDate}</dd>
        </div>
      </dl>

      <Link className="report-card__link" to={`/reports/${encodeURIComponent(report.id)}`}>
        <span>Open report</span>
        <ArrowUpRightIcon />
        <span className="sr-only">: {report.name}</span>
      </Link>
    </article>
  )
}
