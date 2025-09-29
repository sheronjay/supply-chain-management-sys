import { buildLinePath, createPoints } from './chartUtils'

const SatisfactionCard = ({ satisfaction }) => {
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
  )
}

export default SatisfactionCard