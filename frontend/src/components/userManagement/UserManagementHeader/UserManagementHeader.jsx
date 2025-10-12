import './UserManagementHeader.css'

const UserManagementHeader = () => (
  <header className="user-management__header">
    <div>
      <h2>User Management</h2>
      <p>Manage roles, permissions, and account access for your team.</p>
    </div>
    <div className="user-management__header-actions">
      <input type="search" placeholder="Search users..." />
      <button type="button">Add User</button>
    </div>
  </header>
)

export default UserManagementHeader
