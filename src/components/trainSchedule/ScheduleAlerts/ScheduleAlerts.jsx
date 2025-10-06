import './ScheduleAlerts.css'

const ScheduleAlerts = ({ alerts }) => (
  <div className="train-schedule__alerts">
    {alerts.map((alert) => (
      <article key={alert.id} className={`train-schedule__alert train-schedule__alert--${alert.tone}`}>
        <div className="train-schedule__alert-indicator" />
        <div>
          <h3>{alert.title}</h3>
          <p>{alert.description}</p>
        </div>
      </article>
    ))}
  </div>
)

export default ScheduleAlerts
