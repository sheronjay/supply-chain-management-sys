import UserManagementHeader from '../../components/userManagement/UserManagementHeader/UserManagementHeader'
import UserManagementTable from '../../components/userManagement/UserManagementTable/UserManagementTable'
import './UserManagement.css'

const users = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: true },
  { name: 'Bob Williams', email: 'bob@example.com', role: 'Editor', status: true },
  { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: false },
  { name: 'Diana Prince', email: 'diana@example.com', role: 'Viewer', status: true },
  { name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Viewer', status: false },
  { name: 'Fiona Apple', email: 'fiona@example.com', role: 'Viewer', status: true },
]

const roleTone = {
  Admin: 'danger',
  Editor: 'warning',
  Viewer: 'info',
}

const UserManagement = () => (
  <div className="user-management">
    <UserManagementHeader />
    <UserManagementTable users={users} roleTone={roleTone} />
  </div>
)

export default UserManagement
