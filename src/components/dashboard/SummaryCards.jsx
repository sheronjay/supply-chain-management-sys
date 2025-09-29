const SummaryCards = ({ cards }) => (
    <section className="dashboard__cards">
      {cards.map((card) => (
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
  )
  
  export default SummaryCards