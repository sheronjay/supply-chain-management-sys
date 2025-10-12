import './OrderStats.css'

const OrderStats = ({ stats }) => (
  <section className="orders__stats">
    {stats.map((stat) => (
      <div
        key={stat.id}
        className={`orders__card ${stat.accent ? `orders__card--${stat.accent}` : ''}`.trim()}
      >
        <div className="orders__card-header">
          <h3>{stat.title}</h3>
        </div>
        <p className="orders__card-value">{stat.value}</p>
        <p className="orders__card-hint">{stat.hint}</p>
      </div>
    ))}
  </section>
)

export default OrderStats
