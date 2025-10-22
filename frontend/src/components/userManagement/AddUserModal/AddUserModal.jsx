import { useEffect, useState } from 'react'
import api from '../../../services/api'
import './AddUserModal.css'

const roleOptions = [
  'Admin',
  'Main Store Manager',
  'Store Manager',
  'Driver',
  'Assistant',
]

const AddUserModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    user_id: '',
    name: '',
    designation: 'Store Manager',
    password: '',
    store_id: '',
  })
  const [error, setError] = useState('')
  const [stores, setStores] = useState([])
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const loadStores = async () => {
      try {
        const res = await api.get('/train-schedules/stores')
        setStores(res.data || [])
      } catch (e) {
        console.error('Failed to load stores', e)
        setFetchError('Failed to load stores')
      }
    }
    loadStores()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.user_id || !form.name || !form.designation || !form.password || !form.store_id) {
      setError('Please fill all fields')
      return
    }
    onSubmit?.(form)
  }

  return (
    <div className="umodal__overlay">
      <div className="umodal__content">
        <div className="umodal__header">
          <h3>Add User</h3>
          <button type="button" className="umodal__close" onClick={onClose}>×</button>
        </div>
        <form className="umodal__form" onSubmit={handleSubmit}>
          <div className="umodal__group">
            <label htmlFor="user_id">User ID</label>
            <input id="user_id" name="user_id" value={form.user_id} onChange={handleChange} placeholder="e.g., USR-DRV-001" />
          </div>
          <div className="umodal__group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
          </div>
          <div className="umodal__group">
            <label htmlFor="designation">Role</label>
            <select id="designation" name="designation" value={form.designation} onChange={handleChange}>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="umodal__group">
            <label htmlFor="store_id">Store ID</label>
            <select id="store_id" name="store_id" value={form.store_id} onChange={handleChange}>
              <option value="">Select a store</option>
              {stores.map((s) => (
                <option key={s.store_id} value={s.store_id}>{s.store_id} - {s.city}</option>
              ))}
            </select>
            {fetchError && <div className="umodal__error" style={{ marginTop: 8 }}>{fetchError}</div>}
          </div>
          <div className="umodal__group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Set a login password" />
          </div>

          {error && <div className="umodal__error">{error}</div>}

          <div className="umodal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal


