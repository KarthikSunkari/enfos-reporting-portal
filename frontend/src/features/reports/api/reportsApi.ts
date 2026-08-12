import type { ReportSummary } from '../types/report'
import { fetchJsonArray } from './apiClient'

function isReportSummary(value: unknown): value is ReportSummary {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.lastUpdated === 'string' &&
    !Number.isNaN(Date.parse(candidate.lastUpdated)) &&
    typeof candidate.rowCount === 'number' &&
    Number.isInteger(candidate.rowCount) &&
    candidate.rowCount >= 0
  )
}

export async function fetchReports(signal?: AbortSignal): Promise<ReportSummary[]> {
  return fetchJsonArray('/reports', isReportSummary, signal)
}
