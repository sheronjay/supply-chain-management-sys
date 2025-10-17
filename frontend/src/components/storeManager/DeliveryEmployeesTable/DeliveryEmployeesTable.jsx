import PropTypes from 'prop-types'
import './DeliveryEmployeesTable.css'

const DeliveryEmployeesTable = ({ employees, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading delivery employees...</p>
      </div>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" className="empty-icon">
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h3>No Delivery Employees Found</h3>
        <p>There are no delivery employees registered for this store.</p>
      </div>
    )
  }

  return (
    <div className="delivery-employees-container">
      {/* Employees Table */}
      <div className="table-wrapper">
        <table className="delivery-employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Working Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.user_id}>
                <td>
                  <span className="employee-id-badge">{employee.user_id}</span>
                </td>
                <td>
                  <div className="employee-name">
                    <div className="employee-avatar">
                      {employee.designation === 'Driver' ? (
                        <svg viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
                          <circle cx="8" cy="17" r="1" fill="currentColor" />
                          <circle cx="16" cy="17" r="1" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      )}
                    </div>
                    <span>{employee.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`role-badge role-${employee.designation.toLowerCase()}`}>
                    {employee.designation}
                  </span>
                </td>
                <td>
                  <div className="hours-cell">
                    <svg viewBox="0 0 24 24" className="hours-icon">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="hours-value">
                      {parseFloat(employee.working_hours || 0).toFixed(2)} hrs
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      employee.availability ? 'status-available' : 'status-unavailable'
                    }`}
                  >
                    {employee.availability ? 'Available' : 'Unavailable'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

DeliveryEmployeesTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      designation: PropTypes.string.isRequired,
      working_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      availability: PropTypes.number,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
}

export default DeliveryEmployeesTable
