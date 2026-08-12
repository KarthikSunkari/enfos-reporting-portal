import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ReportDetailPage } from './ReportDetailPage'

const users = [
  {
    userId: 'USR-1002',
    name: 'Ethan Brooks',
    email: 'ethan.brooks@enfos.example',
    role: 'Project Manager',
    status: 'Active',
    location: 'Denver, CO',
    createdDate: '2022-08-22',
  },
  {
    userId: 'USR-1001',
    name: 'Maya Patel',
    email: 'maya.patel@enfos.example',
    role: 'Administrator',
    status: 'Inactive',
    location: 'Chicago, IL',
    createdDate: '2022-03-14',
  },
]

const departments = [
  {
    departmentId: 'DEP-101',
    departmentName: 'Environmental Compliance',
    manager: 'Maya Patel',
    employeeCount: 24,
    location: 'Chicago, IL',
  },
]

const projects = [
  {
    projectId: 'PRJ-2401',
    projectName: 'North Harbor Remediation',
    department: 'Remediation Services',
    owner: 'Ethan Brooks',
    status: 'In Progress',
    startDate: '2025-09-15',
    endDate: '2026-12-18',
  },
]

function response(body: unknown, ok = true) {
  return {
    ok,
    status: ok ? 200 : 503,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

function renderRoute(reportId: string) {
  return render(
    <MemoryRouter initialEntries={[`/reports/${reportId}`]}>
      <Routes>
        <Route path="/reports/:reportId" element={<ReportDetailPage />} />
        <Route path="/" element={<p>Landing route</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ReportDetailPage', () => {
  it.each([
    ['users', users, '/api/reports/users', 'Maya Patel'],
    ['departments', departments, '/api/reports/departments', 'Environmental Compliance'],
    ['projects', projects, '/api/reports/projects', 'North Harbor Remediation'],
  ])('loads and renders the %s report from its dedicated endpoint', async (reportId, rows, endpoint, expectedValue) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response(rows))
    vi.stubGlobal('fetch', fetchMock)
    renderRoute(reportId)

    expect(screen.getByRole('status')).toHaveTextContent('Loading report data')
    expect(await screen.findByText(expectedValue)).toBeVisible()
    expect(fetchMock).toHaveBeenCalledWith(
      endpoint,
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
    expect(screen.getByRole('link', { name: 'Back to Reports' })).toHaveAttribute('href', '/')
  })

  it('filters records across all visible fields and clears the query', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response(users)))
    renderRoute('users')

    await screen.findByText('Maya Patel')
    await user.type(screen.getByRole('searchbox', { name: 'Search Users records' }), 'inactive')

    expect(screen.getByText('Maya Patel')).toBeVisible()
    expect(screen.queryByText('Ethan Brooks')).not.toBeInTheDocument()
    expect(screen.getByText('1 of 2 records')).toBeVisible()

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'not-a-record')
    expect(screen.getByRole('heading', { name: 'No records match “not-a-record”' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByText('Ethan Brooks')).toBeVisible()
  })

  it('sorts rows in ascending and descending order', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response(users)))
    renderRoute('users')
    await screen.findByText('Maya Patel')

    const nameHeader = screen.getByRole('columnheader', { name: 'Name' })
    await user.click(within(nameHeader).getByRole('button', { name: 'Name' }))
    let tableRows = screen.getAllByRole('row')
    expect(within(tableRows[1]!).getByText('Ethan Brooks')).toBeVisible()
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')

    await user.click(within(nameHeader).getByRole('button', { name: 'Name' }))
    tableRows = screen.getAllByRole('row')
    expect(within(tableRows[1]!).getByText('Maya Patel')).toBeVisible()
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('renders the empty state when the report has no records', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response([])))
    renderRoute('departments')

    await waitForElementToBeRemoved(() => screen.queryByRole('status'))
    expect(screen.getByRole('heading', { name: 'This report is ready for its first records' })).toBeVisible()
  })

  it('renders an error and recovers when retry succeeds', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(response({}, false))
      .mockResolvedValueOnce(response(projects))
    vi.stubGlobal('fetch', fetchMock)
    renderRoute('projects')

    expect(await screen.findByRole('alert')).toHaveTextContent('Report data is temporarily unavailable')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('North Harbor Remediation')).toBeVisible()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('rejects malformed rows instead of partially rendering unsafe data', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response([
      { userId: 'USR-1001', name: 'Missing required fields' },
    ])))
    renderRoute('users')

    expect(await screen.findByRole('alert')).toHaveTextContent('unexpected format')
    expect(screen.queryByText('Missing required fields')).not.toBeInTheDocument()
  })

  it('handles unknown report routes without making an API request', () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute('financial-secrets')

    expect(screen.getByRole('heading', { name: 'That report doesn’t exist.' })).toBeVisible()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('navigates back to the landing route', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response(users)))
    renderRoute('users')

    await screen.findByText('Maya Patel')
    await user.click(screen.getByRole('link', { name: 'Back to Reports' }))
    expect(screen.getByText('Landing route')).toBeVisible()
  })
})
