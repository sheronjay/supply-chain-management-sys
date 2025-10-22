import { useState } from 'react'
import './EditUserModal.css'

const roleOptions = [
  'Admin',
  'Main Store Manager',
  'Store Manager',
  'Driver',
  'Assistant',
]

const EditUserModal = ({ user, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    user_id: user?.user_id || '',
    name: user?.name || '',
    designation: user?.designation || 'Store Manager',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.designation) {
      setError('Please fill all fields')
      return
    }
    // Do not allow changing user_id here
    onSubmit?.({ name: form.name, designation: form.designation })
  }

  return (
    <div className="umodal__overlay">
      <div className="umodal__content">
        <div className="umodal__header">
          <h3>Edit User</h3>
          <button type="button" className="umodal__close" onClick={onClose}>×</button>
        </div>
        <form className="umodal__form" onSubmit={handleSubmit}>
          <div className="umodal__group">
            <label htmlFor="user_id">User ID</label>
            <input id="user_id" name="user_id" value={form.user_id} disabled />
          </div>
          <div className="umodal__group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="umodal__group">
            <label htmlFor="designation">Role</label>
            <select id="designation" name="designation" value={form.designation} onChange={handleChange}>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {error && <div className="umodal__error">{error}</div>}

          <div className="umodal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal


