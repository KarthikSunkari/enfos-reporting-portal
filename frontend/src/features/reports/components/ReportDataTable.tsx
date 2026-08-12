import { useMemo, useState } from 'react'
import { SearchIcon, SortIcon } from '../../../components/Icons'
import { getRowId } from '../reportDefinitions'
import type {
  ColumnKind,
  ReportCellValue,
  ReportDefinition,
  ReportRow,
} from '../types/reportRows'

interface ReportDataTableProps {
  definition: ReportDefinition
  rows: ReportRow[]
}

interface SortState {
  key: string
  direction: 'ascending' | 'descending'
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function statusTone(value: string) {
  const normalized = value.toLocaleLowerCase()
  if (['active', 'completed'].includes(normalized)) return 'positive'
  if (['in progress', 'planned', 'pending'].includes(normalized)) return 'progress'
  if (['inactive', 'on hold'].includes(normalized)) return 'muted'
  return 'default'
}

function formatValue(value: ReportCellValue, kind: ColumnKind | undefined) {
  if (value === null || value === '') return <span className="table-empty-value">—</span>

  if (kind === 'date' && typeof value === 'string') {
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
  }

  if (kind === 'number' && typeof value === 'number') return value.toLocaleString()

  if (kind === 'email' && typeof value === 'string') {
    return <a className="table-email" href={`mailto:${value}`}>{value}</a>
  }

  if (kind === 'status' && typeof value === 'string') {
    return <span className={`status-pill status-pill--${statusTone(value)}`}>{value}</span>
  }

  return String(value)
}

function compareValues(left: ReportCellValue, right: ReportCellValue, kind: ColumnKind | undefined) {
  if (left === null) return 1
  if (right === null) return -1
  if (kind === 'number' && typeof left === 'number' && typeof right === 'number') return left - right
  if (kind === 'date') return Date.parse(String(left)) - Date.parse(String(right))
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
}

export function ReportDataTable({ definition, rows }: ReportDataTableProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const normalizedQuery = query.trim().toLocaleLowerCase()

  const visibleRows = useMemo(() => {
    const filtered = normalizedQuery
      ? rows.filter((row) => Object.values(row).some((value) =>
          value !== null && String(value).toLocaleLowerCase().includes(normalizedQuery),
        ))
      : [...rows]

    if (!sort) return filtered
    const column = definition.columns.find((candidate) => candidate.key === sort.key)
    if (!column) return filtered

    return filtered.sort((left, right) => {
      const comparison = compareValues(left[column.key] ?? null, right[column.key] ?? null, column.kind)
      return sort.direction === 'ascending' ? comparison : -comparison
    })
  }, [definition.columns, normalizedQuery, rows, sort])

  function toggleSort(key: string) {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 'ascending' ? 'descending' : 'ascending',
    }))
  }

  return (
    <section className="data-panel" aria-labelledby="table-heading">
      <div className="data-panel__toolbar">
        <div>
          <p className="section-index">02 / REPORT DATA</p>
          <h2 id="table-heading">Report records</h2>
          <p aria-live="polite">
            {visibleRows.length.toLocaleString()} of {rows.length.toLocaleString()} records
          </p>
        </div>
        <label className="search-field search-field--table">
          <span className="sr-only">Search {definition.name} records</span>
          <SearchIcon />
          <input
            type="search"
            aria-label={`Search ${definition.name} records`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this report"
            autoComplete="off"
          />
        </label>
      </div>

      {visibleRows.length === 0 ? (
        <div className="table-no-results" role="status">
          <SearchIcon />
          <h3>No records match “{query.trim()}”</h3>
          <p>Try another name, ID, status, or location.</p>
          <button className="button button--secondary" type="button" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="table-scroll" tabIndex={0} aria-label={`${definition.name} report data. Scroll horizontally when needed.`}>
          <table>
            <caption className="sr-only">{definition.name} report with {visibleRows.length} records</caption>
            <thead>
              <tr>
                {definition.columns.map((column) => {
                  const isSorted = sort?.key === column.key
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={isSorted ? sort.direction : 'none'}
                      style={{ minWidth: column.minWidth }}
                    >
                      <button type="button" onClick={() => toggleSort(column.key)}>
                        {column.label}
                        <SortIcon className={isSorted ? 'sort-icon sort-icon--active' : 'sort-icon'} />
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr key={getRowId(definition, row, index)}>
                  {definition.columns.map((column) => (
                    <td key={column.key} data-label={column.label}>
                      {formatValue(row[column.key] ?? null, column.kind)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
