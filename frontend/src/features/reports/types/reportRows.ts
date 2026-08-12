export type ReportCellValue = string | number | null

export interface ReportRow {
  [key: string]: ReportCellValue
}

export interface UserReportRow extends ReportRow {
  userId: string
  name: string
  email: string
  role: string
  status: string
  location: string
  createdDate: string
}

export interface DepartmentReportRow extends ReportRow {
  departmentId: string
  departmentName: string
  manager: string
  employeeCount: number
  location: string
}

export interface ProjectReportRow extends ReportRow {
  projectId: string
  projectName: string
  department: string
  owner: string
  status: string
  startDate: string
  endDate: string
}

export type ReportId = 'users' | 'departments' | 'projects'
export type ColumnKind = 'text' | 'email' | 'number' | 'date' | 'status'

export interface ReportColumn {
  key: string
  label: string
  kind?: ColumnKind
  minWidth?: string
}

export interface ReportDefinition {
  id: ReportId
  name: string
  category: string
  description: string
  endpoint: string
  rowIdKey: string
  columns: readonly ReportColumn[]
  isRow: (value: unknown) => value is ReportRow
}
