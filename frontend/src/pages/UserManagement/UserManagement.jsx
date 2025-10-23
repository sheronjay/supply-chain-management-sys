import { useEffect, useMemo, useState } from 'react'
import UserManagementHeader from '../../components/userManagement/UserManagementHeader/UserManagementHeader'
import UserManagementTable from '../../components/userManagement/UserManagementTable/UserManagementTable'
import { fetchUsers, createUser, updateUser, deleteUser, toggleEmployment } from '../../services/userService'
import AddUserModal from '../../components/userManagement/AddUserModal/AddUserModal'
import EditUserModal from '../../components/userManagement/EditUserModal/EditUserModal'
import './UserManagement.css'

const roleTone = {
  Admin: 'danger',
  'Main Store Manager': 'warning',
  'Store Manager': 'info',
  Driver: 'info',
  Assistant: 'info',
}

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.user_id || '').toLowerCase().includes(q) ||
      (u.designation || '').toLowerCase().includes(q)
    )
  }, [users, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const handleAdd = async (userData) => {
    setAdding(true)
    try {
      await createUser({ ...userData, is_employed: 1 })
      await loadUsers()
      setShowAdd(false)
    } finally {
      setAdding(false)
    }
  }

  const handleEdit = async (userId, updates) => {
    setSaving(true)
    try {
      await updateUser(userId, updates)
      await loadUsers()
      setShowEdit(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (userId) => {
    await deleteUser(userId)
    setUsers(prev => prev.filter(u => u.user_id !== userId))
  }

  const handleToggle = async (userId, next) => {
    await toggleEmployment(userId, next)
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_employed: next ? 1 : 0 } : u))
  }

  return (
    <div className="user-management">
      <UserManagementHeader onAdd={() => setShowAdd(true)} loading={loading} query={query} onQueryChange={setQuery} />
      <UserManagementTable 
        users={currentPageItems} 
        roleTone={roleTone} 
        loading={loading}
        onEdit={(userId) => {
          const u = users.find(x => x.user_id === userId)
          setShowEdit(u || null)
        }}
        onDelete={handleDelete}
        onToggle={handleToggle}
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => Math.min(totalPages, p + 1))}
      />
      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} loading={adding} />
      )}
      {showEdit && (
        <EditUserModal user={showEdit} onClose={() => setShowEdit(null)} onSubmit={(updates)=> handleEdit(showEdit.user_id, updates)} loading={saving} />
      )}
    </div>
  )
}

export default UserManagement
