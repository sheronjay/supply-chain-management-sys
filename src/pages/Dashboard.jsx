const summaryCards = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$6,500',
    change: '+18% vs last week',
    hint: 'Sales this month',
    accent: 'peach',
  },
  {
    id: 'orders',
    title: 'New Orders',
    value: '350',
    change: '+12% vs last week',
    hint: 'Orders this week',
    accent: 'lavender',
  },
  {
    id: 'deliveries',
    title: 'On-Time Delivery',
    value: '97.2%',
    change: '+2.1% vs target',
    hint: 'Delivered on schedule',
    accent: 'mint',
  },
  {
    id: 'satisfaction',
    title: 'Customer Rating',
    value: '4.8 / 5',
    change: 'Based on 1.2k reviews',
    hint: 'Customer feedback',
    accent: 'sky',
  },
]

const orderHistory = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [24, 38, 29, 54, 48, 63, 58],
}

const satisfaction = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  current: [74, 78, 84, 88, 92, 95],
  previous: [68, 72, 76, 82, 86, 88],
}

const alerts = [
  {
    id: 1,
    title: 'Delivery Delay',
    description: '2 orders exceeded the SLA window.',
    status: 'High',
    tone: 'warning',
  },
  {
    id: 2,
    title: 'Inventory Threshold',
    description: 'SKU-0981 and SKU-1023 are running low.',
    status: 'Medium',
    tone: 'caution',
  },
  {
    id: 3,
    title: 'Fleet Maintenance',
    description: 'Vehicle KP-02 scheduled for inspection tomorrow.',
    status: 'Low',
    tone: 'positive',
  },
]

const createPoints = (values, width, height) => {
  if (values.length === 1) {
    return [{ x: width / 2, y: height / 2 }]
  }

  const maxValue = Math.max(...values) * 1.15
  const stepX = width / (values.length - 1)

  return values.map((value, index) => {
    const clamped = Math.max(0, value)
    const ratio = clamped / maxValue
    const x = index * stepX
    const y = height - ratio * height
    return { x, y }
  })
}

const buildLinePath = (points) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ')

const buildAreaPath = (points, width, height) =>
  `M0,${height} ${points.map((point) => `L${point.x},${point.y}`).join(' ')} L${width},${height} Z`

const Dashboard = () => {
  const chartWidth = 620
  const chartHeight = 240
  const orderPoints = createPoints(orderHistory.values, chartWidth, chartHeight)
  const orderHighlightIndex = orderHistory.values.indexOf(Math.max(...orderHistory.values))
  const orderHighlight = orderPoints[orderHighlightIndex]

  const smallChartWidth = 320
  const smallChartHeight = 170
  const satisfactionCurrent = createPoints(
    satisfaction.current,
    smallChartWidth,
    smallChartHeight,
  )
  const satisfactionPrevious = createPoints(
    satisfaction.previous,
    smallChartWidth,
    smallChartHeight,
  )

  return (
    <div className="dashboard">
      <section className="dashboard__cards">
        {summaryCards.map((card) => (
          <article key={card.id} className={`summary-card summary-card--${card.accent}`}>
            <div className="summary-card__badge" />
            <div className="summary-card__content">
              <h3>{card.title}</h3>
              <p className="summary-card__value">{card.value}</p>
              <span className="summary-card__change">{card.change}</span>
              <span className="summary-card__hint">{card.hint}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard__main">
        <article className="card card--wide">
          <header className="card__header">
            <div>
              <h2>Order History</h2>
              <p className="card__subtitle">Weekly quantity overview</p>
            </div>
            <button type="button" className="card__filter">
              Last 7 days
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="m8 10 4 4 4-4" />
              </svg>
            </button>
          </header>

          <div className="order-chart">
            <svg
              className="order-chart__canvas"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6759ff" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="#6759ff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  x2={chartWidth}
                  y1={chartHeight * ratio}
                  y2={chartHeight * ratio}
                  className="order-chart__grid"
                />
              ))}

              <path
                d={buildAreaPath(orderPoints, chartWidth, chartHeight)}
                fill="url(#orderGradient)"
                className="order-chart__area"
              />

              <path
                d={buildLinePath(orderPoints)}
                className="order-chart__line"
                fill="none"
              />

              {orderPoints.map((point, index) => (
                <circle
                  key={point.x}
                  cx={point.x}
                  cy={point.y}
                  r={index === orderHighlightIndex ? 6 : 4}
                  className={`order-chart__dot ${
                    index === orderHighlightIndex ? 'order-chart__dot--active' : ''
                  }`}
                />
              ))}
            </svg>
            <div
              className="order-chart__tooltip"
              style={{
                left: `${(orderHighlight.x / chartWidth) * 100}%`,
                top: `${(orderHighlight.y / chartHeight) * 100}%`,
              }}
            >
              <span className="order-chart__tooltip-value">
                {orderHistory.values[orderHighlightIndex]}%
              </span>
              <span className="order-chart__tooltip-label">Fulfilment rate</span>
            </div>
          </div>

          <div className="order-chart__axis">
            {orderHistory.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </article>

        <div className="dashboard__aside">
          <article className="card satisfaction">
            <header className="card__header">
              <div>
                <h2>Customer Satisfaction</h2>
                <p className="card__subtitle">Support ticket resolution</p>
              </div>
              <div className="satisfaction__legend">
                <span>
                  <span className="legend-dot legend-dot--primary" /> This Month
                </span>
                <span>
                  <span className="legend-dot legend-dot--muted" /> Last Month
                </span>
              </div>
            </header>
            <svg
              className="satisfaction__chart"
              viewBox={`0 0 ${smallChartWidth} ${smallChartHeight}`}
              preserveAspectRatio="none"
            >
              <path
                d={buildLinePath(satisfactionPrevious)}
                className="satisfaction__line satisfaction__line--muted"
                fill="none"
              />
              <path
                d={buildLinePath(satisfactionCurrent)}
                className="satisfaction__line"
                fill="none"
              />
            </svg>
            <div className="satisfaction__labels">
              {satisfaction.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </article>

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
        </div>
      </section>
    </div>
  )
}

export default Dashboard
