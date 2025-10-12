import ReportHeader from '../../components/reportOverview/ReportHeader/ReportHeader'
import ReportFilters from '../../components/reportOverview/ReportFilters/ReportFilters'
import ReportActions from '../../components/reportOverview/ReportActions/ReportActions'
import ReportTable from '../../components/reportOverview/ReportTable/ReportTable'
import './ReportOverview.css'

const filters = [
  { id: 'type', label: 'Report Type', placeholder: 'Daily Sales' },
  { id: 'date', label: 'Select Date Range', placeholder: 'Select Date Range' },
  { id: 'route', label: 'Filter by Route', placeholder: 'Filter by Route' },
  { id: 'category', label: 'All Categories', placeholder: 'All Categories' },
]

const reports = [
  {
    name: 'Daily Sales',
    date: '2024-03-31',
    region: 'North Region',
    category: 'Electronics',
    revenue: 'Rs. 1,245,000',
    transactions: 340,
  },
  {
    name: 'Monthly Revenue',
    date: '2024-03-01',
    region: 'South Region',
    category: 'Apparel',
    revenue: 'Rs. 8,765,500',
    transactions: 90,
  },
  {
    name: 'Product Performance',
    date: '2024-03-15',
    region: 'East Region',
    category: 'Home Goods',
    revenue: 'Rs. 3,540,000',
    transactions: 210,
  },
  {
    name: 'User Activity',
    date: '2024-03-18',
    region: 'West Region',
    category: 'Food & Beverage',
    revenue: 'Rs. 2,450,900',
    transactions: 150,
  },
  {
    name: 'Product Performance',
    date: '2024-03-22',
    region: 'Central Region',
    category: 'Apparel',
    revenue: 'Rs. 1,780,000',
    transactions: 120,
  },
  {
    name: 'Daily Sales',
    date: '2024-03-27',
    region: 'North Region',
    category: 'Electronics',
    revenue: 'Rs. 1,125,000',
    transactions: 290,
  },
]

const ReportOverview = () => (
  <div className="report-overview">
    <ReportHeader />
    <ReportFilters filters={filters} />
    <ReportActions />
    <ReportTable reports={reports} />
  </div>
)

export default ReportOverview
