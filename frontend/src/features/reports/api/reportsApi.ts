import type { ReportSummary } from '../types/report'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 10_000

export class ReportsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ReportsApiError'
  }
}

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
  let response: Response
  const timeoutController = new AbortController()
  const timeoutId = window.setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS)
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal

  try {
    response = await fetch(`${API_BASE_URL}/reports`, {
      headers: { Accept: 'application/json' },
      signal: requestSignal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    if (timeoutController.signal.aborted) {
      throw new ReportsApiError('The reporting service is taking too long to respond. Please try again.')
    }
    throw new ReportsApiError('The reporting service could not be reached. Please try again.')
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new ReportsApiError('The reporting service returned an unexpected response.', response.status)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new ReportsApiError('The reporting service returned data in an unexpected format.')
  }

  if (!Array.isArray(payload) || !payload.every(isReportSummary)) {
    throw new ReportsApiError('The reporting service returned data in an unexpected format.')
  }

  return payload
}
