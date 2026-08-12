import type { ReportDefinition, ReportRow } from '../types/reportRows'
import { fetchJsonArray } from './apiClient'

export function fetchReportRows(
  definition: ReportDefinition,
  signal?: AbortSignal,
): Promise<ReportRow[]> {
  return fetchJsonArray(definition.endpoint, definition.isRow, signal)
}
