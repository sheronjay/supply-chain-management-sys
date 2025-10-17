import './ScheduleTable.css'

const ScheduleTable = ({ trips, statusTone }) => (
  <section className="train-schedule__card">
    <header className="train-schedule__tabs">
      <button type="button" className="train-schedule__tab train-schedule__tab--active">
        Train Schedule
      </button>
    </header>

    <table className="train-schedule__table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Departure</th>
          <th>Train ID</th>
          <th>Train Name</th>
          <th>Used Capacity</th>
          <th>Available Capacity</th>
          <th>Total Capacity</th>
          <th>Status</th>
          <th>Destination</th>
        </tr>
      </thead>
      <tbody>
        {trips.length === 0 ? (
          <tr>
            <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No train schedules available
            </td>
          </tr>
        ) : (
          trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.date}</td>
              <td>{trip.time}</td>
              <td className="train-id">{trip.trainId}</td>
              <td>{trip.trainName}</td>
              <td className="capacity-used">{trip.assigned} units</td>
              <td className="capacity-available">{trip.available} units</td>
              <td className="capacity-total">{trip.capacity} units</td>
              <td>
                <span className={`train-schedule__status train-schedule__status--${statusTone[trip.status]}`}>
                  {trip.status}
                </span>
              </td>
              <td>{trip.route}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {trips.length > 0 && (
      <footer className="train-schedule__footer">
        <span>Showing {trips.length} trip{trips.length !== 1 ? 's' : ''}</span>
      </footer>
    )}
  </section>
)

export default ScheduleTable
