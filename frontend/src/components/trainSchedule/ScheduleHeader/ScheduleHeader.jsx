import './ScheduleHeader.css'

const ScheduleHeader = ({ onRefresh }) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="train-schedule__header">
      <div>
        <h2>Train Schedule Overview</h2>
        <p>Today, {today}</p>
      </div>
      <div className="train-schedule__actions">
        {onRefresh && (
          <button 
            type="button" 
            className="train-schedule__button train-schedule__button--secondary"
            onClick={onRefresh}
          >
            Refresh Schedule
          </button>
        )}
      </div>
    </header>
  )
}

export default ScheduleHeader
