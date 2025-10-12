import './ReportFilters.css'

const ReportFilters = ({ filters }) => (
  <div className="report-overview__filters">
    {filters.map((filter) => (
      <button key={filter.id} type="button" className="report-overview__filter">
        <span>{filter.placeholder}</span>
      </button>
    ))}
  </div>
)

export default ReportFilters
