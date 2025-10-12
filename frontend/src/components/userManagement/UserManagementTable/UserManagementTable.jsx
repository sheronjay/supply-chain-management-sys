import './UserManagementTable.css'

const UserManagementTable = ({ users, roleTone }) => (
  <section className="user-management__card">
    <table className="user-management__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <span className={`user-management__role user-management__role--${roleTone[user.role]}`}>
                {user.role}
              </span>
            </td>
            <td>
              <label className="user-management__toggle">
                <input type="checkbox" checked={user.status} readOnly />
                <span className="user-management__slider" />
              </label>
            </td>
            <td>
              <div className="user-management__actions">
                <button type="button" className="user-management__icon-button user-management__icon-button--edit">
                  Edit
                </button>
                <button type="button" className="user-management__icon-button user-management__icon-button--delete">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <footer className="user-management__footer">
      <span>Showing 6 of 18 users</span>
      <div className="user-management__pagination">
        <button type="button">Previous</button>
        <div>
          <button type="button" className="is-active">
            1
          </button>
          <button type="button">2</button>
          <button type="button">3</button>
        </div>
        <button type="button">Next</button>
      </div>
    </footer>
  </section>
)

export default UserManagementTable
