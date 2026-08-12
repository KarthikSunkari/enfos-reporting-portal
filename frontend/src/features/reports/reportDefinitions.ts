import type {
  DepartmentReportRow,
  ProjectReportRow,
  ReportDefinition,
  ReportId,
  ReportRow,
  UserReportRow,
} from './types/reportRows'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function hasStrings(value: Record<string, unknown>, fields: readonly string[]) {
  return fields.every((field) => typeof value[field] === 'string')
}

function hasIsoDates(value: Record<string, unknown>, fields: readonly string[]) {
  return fields.every((field) => {
    const candidate = value[field]
    return typeof candidate === 'string' && !Number.isNaN(Date.parse(candidate))
  })
}

function isUserRow(value: unknown): value is UserReportRow {
  return (
    isObject(value) &&
    hasStrings(value, ['userId', 'name', 'email', 'role', 'status', 'location']) &&
    hasIsoDates(value, ['createdDate'])
  )
}

function isDepartmentRow(value: unknown): value is DepartmentReportRow {
  return (
    isObject(value) &&
    hasStrings(value, ['departmentId', 'departmentName', 'manager', 'location']) &&
    typeof value.employeeCount === 'number' &&
    Number.isInteger(value.employeeCount) &&
    value.employeeCount >= 0
  )
}

function isProjectRow(value: unknown): value is ProjectReportRow {
  return (
    isObject(value) &&
    hasStrings(value, ['projectId', 'projectName', 'department', 'owner', 'status']) &&
    hasIsoDates(value, ['startDate', 'endDate'])
  )
}

const reportDefinitions = {
  users: {
    id: 'users',
    name: 'Users',
    category: 'People & access',
    description: 'People with access to the reporting platform, their roles, and account status.',
    endpoint: '/reports/users',
    rowIdKey: 'userId',
    isRow: isUserRow,
    columns: [
      { key: 'userId', label: 'User ID', minWidth: '120px' },
      { key: 'name', label: 'Name', minWidth: '160px' },
      { key: 'email', label: 'Email', kind: 'email', minWidth: '230px' },
      { key: 'role', label: 'Role', minWidth: '150px' },
      { key: 'status', label: 'Status', kind: 'status', minWidth: '112px' },
      { key: 'location', label: 'Location', minWidth: '140px' },
      { key: 'createdDate', label: 'Created', kind: 'date', minWidth: '130px' },
    ],
  },
  departments: {
    id: 'departments',
    name: 'Departments',
    category: 'Organization',
    description: 'Team ownership, staffing levels, and office locations across the organization.',
    endpoint: '/reports/departments',
    rowIdKey: 'departmentId',
    isRow: isDepartmentRow,
    columns: [
      { key: 'departmentId', label: 'Department ID', minWidth: '145px' },
      { key: 'departmentName', label: 'Department', minWidth: '220px' },
      { key: 'manager', label: 'Manager', minWidth: '160px' },
      { key: 'employeeCount', label: 'Employees', kind: 'number', minWidth: '120px' },
      { key: 'location', label: 'Location', minWidth: '150px' },
    ],
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    category: 'Delivery',
    description: 'Active, planned, paused, and completed environmental work across teams.',
    endpoint: '/reports/projects',
    rowIdKey: 'projectId',
    isRow: isProjectRow,
    columns: [
      { key: 'projectId', label: 'Project ID', minWidth: '120px' },
      { key: 'projectName', label: 'Project', minWidth: '230px' },
      { key: 'department', label: 'Department', minWidth: '190px' },
      { key: 'owner', label: 'Owner', minWidth: '150px' },
      { key: 'status', label: 'Status', kind: 'status', minWidth: '120px' },
      { key: 'startDate', label: 'Start date', kind: 'date', minWidth: '125px' },
      { key: 'endDate', label: 'End date', kind: 'date', minWidth: '125px' },
    ],
  },
} as const satisfies Record<ReportId, ReportDefinition>

export function isReportId(value: string | undefined): value is ReportId {
  return value !== undefined && Object.hasOwn(reportDefinitions, value)
}

export function getReportDefinition(value: string | undefined): ReportDefinition | undefined {
  return isReportId(value) ? reportDefinitions[value] : undefined
}

export function getRowId(definition: ReportDefinition, row: ReportRow, index: number) {
  const value = row[definition.rowIdKey]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : `${definition.id}-${index}`
}
