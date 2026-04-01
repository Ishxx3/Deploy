import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { VehicleDetail } from './pages/VehicleDetail'
import { Vehicles } from './pages/Vehicles'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projet" element={<About />} />
          <Route path="vehicules" element={<Vehicles />} />
          <Route path="vehicules/:id" element={<VehicleDetail />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/tableau" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
