import { useState, useEffect } from 'react';
import api from '../../../services/api';
import './AddScheduleModal.css';

const AddScheduleModal = ({ onClose, onAdd }) => {
  const [trains, setTrains] = useState([]);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    day_date: '',
    start_time: '',
    arrival_time: '',
    train_id: '',
    end_store_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainsRes, storesRes] = await Promise.all([
          api.get('/train-schedules/trains'),
          api.get('/train-schedules/stores')
        ]);

        setTrains(trainsRes.data);
        setStores(storesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/train-schedules', formData);
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Train Schedule</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label htmlFor="day_date">Date</label>
            <input
              type="date"
              id="day_date"
              name="day_date"
              value={formData.day_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Departure Time</label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="arrival_time">Arrival Time</label>
              <input
                type="time"
                id="arrival_time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="train_id">Train</label>
            <select
              id="train_id"
              name="train_id"
              value={formData.train_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a train</option>
              {trains.map(train => (
                <option key={train.train_id} value={train.train_id}>
                  {train.train_name} (Capacity: {train.capacity} units)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="end_store_id">Destination</label>
            <select
              id="end_store_id"
              name="end_store_id"
              value={formData.end_store_id}
              onChange={handleChange}
              required
            >
              <option value="">Select destination</option>
              {stores.map(store => (
                <option key={store.store_id} value={store.store_id}>
                  {store.city}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;