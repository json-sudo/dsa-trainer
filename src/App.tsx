import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { applyThemeClass } from './state/appState'
import { RoadmapPage } from './pages/RoadmapPage'
import { TopicPage } from './pages/TopicPage'
import { PatternsPage } from './pages/PatternsPage'
import { ProgressPage } from './pages/ProgressPage'
import { WizardPage } from './pages/WizardPage'

export default function App() {
  useEffect(() => {
    applyThemeClass()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<RoadmapPage />} />
      <Route path="/topic/:topicId" element={<TopicPage />} />
      <Route path="/patterns" element={<PatternsPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/problem/:problemId" element={<WizardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
