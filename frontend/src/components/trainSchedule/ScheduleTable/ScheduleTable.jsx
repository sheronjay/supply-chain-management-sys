import './ScheduleTable.css'

const ScheduleTable = ({ trips, statusTone }) => (
  <section className="train-schedule__card">
    <header className="train-schedule__tabs">
      <button type="button" className="train-schedule__tab train-schedule__tab--active">
        Train Schedule
      </button>
      <button type="button" className="train-schedule__tab">Truck Schedule</button>
      <button type="button" className="train-schedule__tab">Assigned Orders</button>
    </header>

    <table className="train-schedule__table">
      <thead>
        <tr>
          <th>Departure</th>
          <th>Train ID</th>
          <th>Assigned Orders</th>
          <th>Capacity</th>
          <th>Status</th>
          <th>Train Lead</th>
          <th>Route</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((trip) => (
          <tr key={trip.id}>
            <td>{trip.time}</td>
            <td>{trip.id}</td>
            <td>{trip.assigned}</td>
            <td>{trip.capacity}</td>
            <td>
              <span className={`train-schedule__status train-schedule__status--${statusTone[trip.status]}`}>
                {trip.status}
              </span>
            </td>
            <td>{trip.lead}</td>
            <td>{trip.route}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <footer className="train-schedule__footer">
      <span>Showing 6 of 12 trips</span>
      <div className="train-schedule__pagination">
        <button type="button">1</button>
        <button type="button" className="is-active">
          2
        </button>
        <button type="button">3</button>
        <button type="button">Next &rsaquo;</button>
      </div>
    </footer>
  </section>
)

export default ScheduleTable
