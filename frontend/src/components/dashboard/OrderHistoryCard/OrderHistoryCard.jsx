import './OrderHistoryCard.css'
import { buildAreaPath, buildLinePath, createPoints } from '../utils/chartUtils'

const OrderHistoryCard = ({ history }) => {
  const chartWidth = 620
  const chartHeight = 240
  const orderPoints = createPoints(history.values, chartWidth, chartHeight)
  const orderHighlightIndex = history.values.indexOf(Math.max(...history.values))
  const orderHighlight = orderPoints[orderHighlightIndex]

  return (
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
            {history.values[orderHighlightIndex]}%
          </span>
          <span className="order-chart__tooltip-label">Fulfilment rate</span>
        </div>
      </div>

      <div className="order-chart__axis">
        {history.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </article>
  )
}

export default OrderHistoryCard
