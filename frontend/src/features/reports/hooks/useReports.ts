import { useCallback, useEffect, useState } from 'react'
import { fetchReports } from '../api/reportsApi'
import type { ReportSummary } from '../types/report'

interface ReportsState {
  reports: ReportSummary[]
  isLoading: boolean
  error: string | null
}

const initialState: ReportsState = {
  reports: [],
  isLoading: true,
  error: null,
}

export function useReports() {
  const [state, setState] = useState<ReportsState>(initialState)
  const [requestId, setRequestId] = useState(0)

  const retry = useCallback(() => {
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, isLoading: true, error: null }))

    void fetchReports(controller.signal)
      .then((reports) => {
        setState({ reports, isLoading: false, error: null })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return

        setState({
          reports: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        })
      })

    return () => controller.abort()
  }, [requestId])

  return { ...state, retry }
}
