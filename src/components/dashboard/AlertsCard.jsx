const AlertsCard = ({ alerts }) => (
    <article className="card alerts">
      <header className="card__header">
        <div>
          <h2>System Alerts</h2>
          <p className="card__subtitle">Live monitoring</p>
        </div>
      </header>
      <ul className="alerts__list">
        {alerts.map((alert) => (
          <li key={alert.id} className={`alerts__item alerts__item--${alert.tone}`}>
            <div className="alerts__status">{alert.status}</div>
            <div className="alerts__content">
              <p className="alerts__title">{alert.title}</p>
              <span className="alerts__description">{alert.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
  
  export default AlertsCard