import OrderSummary from '../../components/orders/OrderSummary/OrderSummary'
import OrderStats from '../../components/orders/OrderStats/OrderStats'
import RecentOrdersTable from '../../components/orders/RecentOrdersTable/RecentOrdersTable'
import './Orders.css'

const orderStats = [
  {
    id: 'total',
    title: 'Total Orders',
    value: '1,280',
    hint: '+15% from last month',
  },
  {
    id: 'pending',
    title: 'Pending',
    value: '125',
    hint: 'Awaiting fulfillment',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    value: '1,155',
    hint: '90% completion rate',
  },
  {
    id: 'average',
    title: 'Avg. Order Value',
    value: 'LKR 325,505',
    hint: 'Updated 1 hour ago',
    accent: 'highlight',
  },
]

const recentOrders = [
  { id: 'ORD001', customer: 'Alice Smith', date: '2025-08-02', status: 'Delivered' },
  { id: 'ORD002', customer: 'Bob Johnson', date: '2025-08-12', status: 'Pending' },
  { id: 'ORD003', customer: 'Charlie Brown', date: '2025-08-13', status: 'Canceled' },
  { id: 'ORD004', customer: 'Diana Prince', date: '2025-08-16', status: 'Delivered' },
  { id: 'ORD005', customer: 'Eva Adams', date: '2025-08-18', status: 'Pending' },
]

const statusTone = {
  Delivered: 'success',
  Pending: 'warning',
  Canceled: 'danger',
}

const Orders = () => (
  <div className="orders">
    <OrderSummary />
    <OrderStats stats={orderStats} />
    <RecentOrdersTable orders={recentOrders} statusTone={statusTone} />
  </div>
)

export default Orders
