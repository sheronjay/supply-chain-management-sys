import './Dashboard.css'
import AlertsCard from '../../components/dashboard/AlertsCard/AlertsCard'
import OrderHistoryCard from '../../components/dashboard/OrderHistoryCard/OrderHistoryCard'
import SatisfactionCard from '../../components/dashboard/SatisfactionCard/SatisfactionCard'
import SummaryCards from '../../components/dashboard/SummaryCards/SummaryCards'
import { fetchMonthlyRevenue } from '../../services/dashboardService'
import { fetchNewOrdersCount } from '../../services/dashboardService'
import { fetchCompletedDeliveries } from '../../services/dashboardService'
import { fetchOrderHistory } from '../../services/dashboardService'
import { useState, useEffect } from "react";

const  createInitialSummaryCards = () => [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 'Loading…',
    change: 'Fetching latest totals…',
    hint: 'Sales for the current month',
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
    title: 'Completed Deliveries',
    value: '97.2%',
    change: '+2.1% vs target',
    hint: 'Delivered on schedule',
    accent: 'mint',
  },
  {
    id: 'satisfaction',
    title: 'Late Deliveries',
    value: '4.8 / 5',
    change: 'Based on 1.2k reviews',
    hint: 'Customer feedback',
    accent: 'sky',
  },
]

const createInitialOrderHistory = () => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [0, 0, 0, 0, 0, 0, 0],
})

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

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, 1))
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const Dashboard = () => {
  const [summaryCards, setSummaryCards] = useState(createInitialSummaryCards)
  const [orderHistory, setOrderHistory] = useState(createInitialOrderHistory)

  useEffect(() => {
    let isMounted = true

    const loadDashboardData = async () => {
      try {
        const [revenueData, ordersData,completedDeliveriesData, orderHistoryData] = await Promise.all([
          fetchMonthlyRevenue(),
          fetchNewOrdersCount(),
          fetchCompletedDeliveries(),
          fetchOrderHistory(),
        ])
        if (!isMounted) return

        const formattedRevenue = formatCurrency(revenueData.totalRevenue)
        const monthLabel = formatMonthLabel(revenueData.month)

        const formattedOrdersCount = ordersData.newOrdersCount
        const lastMonthOrdersCount = ordersData.lastMonthOrdersCount

        const formattedCompletedDeliveries = completedDeliveriesData.completedDeliveries

        setSummaryCards((prevCards) =>
          prevCards.map((card) =>
            card.id === 'revenue'
              ? {
                  ...card,
                  value: formattedRevenue,
                  change: 'Updated from live orders data',
                  hint: `Sales this month (${monthLabel})`,
                }
              : card.id === 'orders'
                ? {
                    ...card,
                    value: formattedOrdersCount,
                    change: `+${((formattedOrdersCount - lastMonthOrdersCount)*100/lastMonthOrdersCount).toFixed(2)}% vs last month`,
                    hint: `Orders this month (${monthLabel})`,
                  }
                : card.id === 'deliveries'
                ? {
                    ...card,
                    value: formattedCompletedDeliveries,
                    change: 'Updated from live orders data',
                    hint: `Deliveries this month (${monthLabel})`,
                  }
                  : card
          )
        )

        // Transform order history data
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const labels = orderHistoryData.map(item => {
          const date = new Date(item.date)
          return dayNames[date.getDay()]
        })
        const values = orderHistoryData.map(item => item.orderCount)

        setOrderHistory({
          labels,
          values,
        })
      } catch (error) {
        console.error('Failed to fetch revenue for dashboard', error)
        if (!isMounted) return

        setSummaryCards((prevCards) =>
          prevCards.map((card) =>
            card.id === 'revenue'
              ? {
                  ...card,
                  value: 'Unavailable',
                  change: 'Could not reach API',
                  hint: 'Please try again later.',
                }
              : card.id === 'orders'
                ? {
                    ...card,
                    value: 'Unavailable',
                    change: 'Could not reach API',
                    hint: 'Please try again later.',
                  }
                : card.id === 'deliveries'
                ? {
                    ...card,
                    value: 'Unavailable',
                    change: 'Could not reach API',
                    hint: 'Please try again later.',
                  }
                  : card
          )
        )
      }
    }


    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
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
}

export default Dashboard