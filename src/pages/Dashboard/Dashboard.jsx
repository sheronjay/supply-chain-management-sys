import './Dashboard.css'
import AlertsCard from '../../components/dashboard/AlertsCard/AlertsCard'
import OrderHistoryCard from '../../components/dashboard/OrderHistoryCard/OrderHistoryCard'
import SatisfactionCard from '../../components/dashboard/SatisfactionCard/SatisfactionCard'
import SummaryCards from '../../components/dashboard/SummaryCards/SummaryCards'

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

const Dashboard = () => (
  <div className="dashboard">
    <SummaryCards cards={summaryCards} />
    <section className="dashboard__main">
      <OrderHistoryCard history={orderHistory} />
      <div className="dashboard__aside">
        <SatisfactionCard satisfaction={satisfaction} />
        <AlertsCard alerts={alerts} />
      </div>
    </section>
  </div>
)

export default Dashboard
