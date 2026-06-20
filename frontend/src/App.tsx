import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import GeneratorPage from './pages/GeneratorPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/generator" element={<GeneratorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
