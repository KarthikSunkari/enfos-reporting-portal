import { useCallback, useEffect, useState } from 'react'
import { fetchReportRows } from '../api/reportRowsApi'
import type { ReportDefinition, ReportRow } from '../types/reportRows'

interface ReportRowsState {
  rows: ReportRow[]
  isLoading: boolean
  error: string | null
}

export function useReportRows(definition: ReportDefinition | undefined) {
  const [state, setState] = useState<ReportRowsState>({
    rows: [],
    isLoading: definition !== undefined,
    error: null,
  })
  const [requestId, setRequestId] = useState(0)

  const retry = useCallback(() => {
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!definition) {
      setState({ rows: [], isLoading: false, error: null })
      return
    }

    const controller = new AbortController()
    setState((current) => ({ ...current, isLoading: true, error: null }))

    void fetchReportRows(definition, controller.signal)
      .then((rows) => setState({ rows, isLoading: false, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          rows: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        })
      })

    return () => controller.abort()
  }, [definition, requestId])

  return { ...state, retry }
}
