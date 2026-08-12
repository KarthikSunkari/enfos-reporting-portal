import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ReportsLandingPage } from './ReportsLandingPage'

const reports = [
  {
    id: 'users',
    name: 'Users',
    description: 'People with access to the reporting platform.',
    lastUpdated: '2026-08-11T19:20:00Z',
    rowCount: 6,
  },
  {
    id: 'departments',
    name: 'Departments',
    description: 'Teams, managers, staffing, and office locations.',
    lastUpdated: '2026-08-10T14:05:00Z',
    rowCount: 4,
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Active, planned, and completed environmental work.',
    lastUpdated: '2026-08-12T00:35:00Z',
    rowCount: 5,
  },
]

function mockResponse(body: unknown, ok = true) {
  return vi.fn<typeof fetch>().mockResolvedValue({
    ok,
    status: ok ? 200 : 503,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response)
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ReportsLandingPage />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ReportsLandingPage', () => {
  it('renders report metadata returned by the API', async () => {
    vi.stubGlobal('fetch', mockResponse(reports))
    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent('Loading reports')
    expect(await screen.findByRole('heading', { name: 'Users' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Departments' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeVisible()
    expect(screen.getByText('15')).toBeVisible()
    const latestUpdate = screen.getByText('Latest data update').nextElementSibling
    expect(latestUpdate).toHaveTextContent(/Aug \d{1,2}, 2026/)
    expect(latestUpdate).not.toHaveTextContent(/AM|PM|:/)
  })

  it('filters reports by name without case sensitivity', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', mockResponse(reports))
    renderPage()

    await screen.findByRole('heading', { name: 'Users' })
    await user.type(screen.getByRole('searchbox', { name: 'Search reports by name' }), 'PROJ')

    expect(screen.getByRole('heading', { name: 'Projects' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Users' })).not.toBeInTheDocument()
    expect(screen.getByText('1 match')).toBeVisible()
  })

  it('offers a clear action when search has no matches', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', mockResponse(reports))
    renderPage()

    await screen.findByRole('heading', { name: 'Users' })
    await user.type(screen.getByRole('searchbox'), 'finance')
    expect(screen.getByRole('heading', { name: 'No reports found for “finance”' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('heading', { name: 'Users' })).toBeVisible()
  })

  it('renders an intentional empty state', async () => {
    vi.stubGlobal('fetch', mockResponse([]))
    renderPage()

    await waitForElementToBeRemoved(() => screen.queryByRole('status'))
    expect(screen.getByRole('heading', { name: 'No reports are available yet' })).toBeVisible()
  })

  it('renders an error state and retries the request', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce({ ok: false, status: 503 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(reports),
      } as unknown as Response)
    vi.stubGlobal('fetch', fetchMock)
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Reports are temporarily unavailable')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeVisible()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('updates the no-results state when the native clear control resets search', async () => {
    vi.stubGlobal('fetch', mockResponse(reports))
    renderPage()

    await screen.findByRole('heading', { name: 'Users' })
    const search = screen.getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'unknown' } })
    expect(screen.getByText(/No reports found/)).toBeVisible()
    fireEvent.change(search, { target: { value: '' } })
    expect(screen.getByRole('heading', { name: 'Users' })).toBeVisible()
  })
})
