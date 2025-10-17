import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeRedirect() {
  const { user } = useAuth();

  if (!user || user.userType !== 'employee') {
    return <Navigate to="/employee" replace />;
  }

  // Redirect based on employee designation
  if (user.designation === 'Main Store Manager') {
    return <Navigate to="/main-stores" replace />;
  }

  if (user.designation === 'Store Manager') {
    return <Navigate to="/store-manager" replace />;
  }

  if (user.designation === 'Driver' || user.designation === 'Assistant') {
    return <Navigate to="/drivers" replace />;
  }

  // Default to dashboard for other employees
  return <Navigate to="/dashboard" replace />;
}
