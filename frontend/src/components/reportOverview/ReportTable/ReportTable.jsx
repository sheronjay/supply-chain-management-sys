import './ReportTable.css'

const ReportTable = ({ reports }) => (
  <section className="report-overview__card">
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>Report Type</th>
          <th>Date</th>
          <th>Route</th>
          <th>Product Category</th>
          <th>Sales Amount</th>
          <th>Transactions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={`${report.name}-${report.date}`}>
            <td>{report.name}</td>
            <td>{report.date}</td>
            <td>{report.region}</td>
            <td>{report.category}</td>
            <td>{report.revenue}</td>
            <td>{report.transactions}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <footer className="report-overview__footer">
      <span>Showing 6 of 24 reports</span>
      <div className="report-overview__pagination">
        <button type="button">Previous</button>
        <span>Page 1 of 4</span>
        <button type="button">Next</button>
      </div>
    </footer>
  </section>
)

export default ReportTable
