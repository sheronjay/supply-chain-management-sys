import './UserManagementTable.css'

const UserManagementTable = ({ users, roleTone, loading, onEdit, onDelete, onToggle, page = 1, totalPages = 1, onPrev, onNext }) => (
  <section className="user-management__card">
    <table className="user-management__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>User ID</th>
          <th>Role</th>
          <th>Employed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan="5" style={{ textAlign:'center', padding:'24px' }}>Loading users...</td></tr>
        ) : users.length === 0 ? (
          <tr><td colSpan="5" style={{ textAlign:'center', padding:'24px' }}>No users</td></tr>
        ) : users.map((user) => (
          <tr key={user.user_id}>
            <td>{user.name}</td>
            <td className="user-id">{user.user_id}</td>
            <td>
              <span className={`user-management__role user-management__role--${roleTone[user.designation] || 'info'}`}>
                {user.designation}
              </span>
            </td>
            <td>
              <label className="user-management__toggle">
                <input type="checkbox" checked={!!user.is_employed} onChange={(e)=> onToggle?.(user.user_id, e.target.checked)} />
                <span className="user-management__slider" />
              </label>
            </td>
            <td>
              <div className="user-management__actions">
                <button type="button" className="user-management__icon-button user-management__icon-button--edit" onClick={()=> onEdit?.(user.user_id, { name: user.name })}>
                  Edit
                </button>
                <button type="button" className="user-management__icon-button user-management__icon-button--delete" onClick={()=> onDelete?.(user.user_id)}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <footer className="user-management__footer">
      <span>Page {page} of {totalPages}</span>
      <div className="user-management__pagination">
        <button type="button" onClick={onPrev} disabled={page <= 1}>Previous</button>
        <div>
          <button type="button" className="is-active">{page}</button>
        </div>
        <button type="button" onClick={onNext} disabled={page >= totalPages}>Next</button>
      </div>
    </footer>
  </section>
)

export default UserManagementTable
