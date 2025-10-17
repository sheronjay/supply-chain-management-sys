import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import CustomerLogin from './pages/Auth/CustomerLogin';
import EmployeeLogin from './pages/Auth/EmployeeLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import Orders from './pages/Orders/Orders';
import UserOrders from './pages/userOrders/UserOrders';
import MainStores from './pages/MainStores/MainStores';
import StoreManager from './pages/StoreManager/StoreManager';
import Drivers from './pages/Drivers/Drivers';
import TrainSchedule from './pages/TrainSchedule/TrainSchedule';
import ReportOverview from './pages/ReportOverview/ReportOverview';
import UserManagement from './pages/UserManagement/UserManagement';
import './App.css';

const createPlaceholder = (label) => (
  <div className="placeholder">
    <h2>{label}</h2>
    <p>The {label.toLowerCase()} module is under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CustomerLogin />} />
          <Route path="/employee" element={<EmployeeLogin />} />

          {/* Customer Routes */}
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedUserTypes={['customer']}>
                <DashboardLayout pageName="UserOrders">
                  <UserOrders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="Dashboard">
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="Orders">
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/main-stores"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="MainStores">
                  <MainStores />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/store-manager"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="StoreManager">
                  <StoreManager />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="Drivers">
                  <Drivers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/train-schedule"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="TrainSchedule">
                  <TrainSchedule />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="ReportOverview">
                  <ReportOverview />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="UserManagement">
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedUserTypes={['employee']}>
                <DashboardLayout pageName="Settings">
                  {createPlaceholder('Settings')}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
