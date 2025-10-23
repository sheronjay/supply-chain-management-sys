import './UserManagementHeader.css'

const UserManagementHeader = ({ onAdd, loading, query, onQueryChange }) => (
  <header className="user-management__header">
    <div>
      <h2>User Management</h2>
      <p>Manage roles, permissions, and account access for your team.</p>
    </div>
    <div className="user-management__header-actions">
      <input type="search" placeholder="Search users..." value={query} onChange={(e) => onQueryChange?.(e.target.value)} />
      <button type="button" disabled={loading} onClick={() => onAdd?.()}>Add User</button>
    </div>
  </header>
)

export default UserManagementHeader
