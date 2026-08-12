import { Navigate, Route, Routes } from 'react-router'
import { ReportDetailPage } from '../features/reports/pages/ReportDetailPage'
import { ReportsLandingPage } from '../features/reports/pages/ReportsLandingPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportsLandingPage />} />
      <Route path="/reports/:reportId" element={<ReportDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
