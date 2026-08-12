import { Navigate, Route, Routes } from 'react-router'
import { ReportComingSoonPage } from '../features/reports/pages/ReportComingSoonPage'
import { ReportsLandingPage } from '../features/reports/pages/ReportsLandingPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportsLandingPage />} />
      <Route path="/reports/:reportId" element={<ReportComingSoonPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
