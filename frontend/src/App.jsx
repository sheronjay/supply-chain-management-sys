import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import OrganizationPortal from './portals/OrganizationPortal'
import CustomerPortal from './portals/CustomerPortal'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/org" element={<OrganizationPortal />} />
        <Route path="/customer" element={<CustomerPortal />} />
        <Route path="/" element={<Navigate to="/org" replace />} />
      </Routes>
    </Router>
  )
}

export default App

