import './ScheduleHeader.css'

const ScheduleHeader = () => (
  <header className="train-schedule__header">
    <div>
      <h2>Train Schedule Overview</h2>
      <p>Today, August 07, 2025</p>
    </div>
    <div className="train-schedule__actions">
      <button type="button" className="train-schedule__button train-schedule__button--primary">
        Add New Trip
      </button>
      <button type="button" className="train-schedule__button train-schedule__button--secondary">
        Export Schedule
      </button>
    </div>
  </header>
)

export default ScheduleHeader
