import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EmployeeLogin.css';

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { employeeLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await employeeLogin(formData.userId, formData.password);
      
      // Redirect based on employee designation
      const user = result.user;
      if (user.designation === 'Main Store Manager') {
        navigate('/main-stores');
      } else if (user.designation === 'Store Manager') {
        navigate('/store-manager');
      } else if (user.designation === 'Driver' || user.designation === 'Assistant') {
        navigate('/drivers');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-login-container">
      <div className="employee-login-card">
        <div className="employee-login-header">
          <h1>Employee Portal</h1>
          <p>Sign in to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="employee-login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="userId">Employee ID</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              placeholder="Enter your employee ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="customer-link">
          <p>
            Are you a customer?{' '}
            <a href="/">Go to Customer Portal</a>
          </p>
        </div>

        <div className="info-box">
          <p className="info-text">
            <strong>Note:</strong> Only authorized employees can access this portal.
            If you need access, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
