import './Dashboard.css'
import AlertsCard from '../../components/dashboard/AlertsCard/AlertsCard'
import OrderHistoryCard from '../../components/dashboard/OrderHistoryCard/OrderHistoryCard'
import SummaryCards from '../../components/dashboard/SummaryCards/SummaryCards'
import { fetchMonthlyRevenue } from '../../services/dashboardService'
import { fetchNewOrdersCount } from '../../services/dashboardService'
import { fetchCompletedDeliveries } from '../../services/dashboardService'
import { fetchOrderHistory } from '../../services/dashboardService'
import { fetchLateDeliveries } from '../../services/dashboardService'
import { fetchSystemAlerts } from '../../services/dashboardService'
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
    value: 'Loading…',
    change: 'Fetching data…',
    hint: 'Orders delivered after 14 days',
    accent: 'sky',
  },
]

const createInitialOrderHistory = () => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [0, 0, 0, 0, 0, 0, 0],
})

const createInitialAlerts = () => [
  {
    id: 'alert-loading',
    title: 'Loading Alerts',
    description: 'Fetching system alerts...',
    status: 'Info',
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
  const [alerts, setAlerts] = useState(createInitialAlerts)

  useEffect(() => {
    let isMounted = true

    const loadDashboardData = async () => {
      try {
        const [revenueData, ordersData,completedDeliveriesData, orderHistoryData, lateDeliveriesData, alertsData] = await Promise.all([
          fetchMonthlyRevenue(),
          fetchNewOrdersCount(),
          fetchCompletedDeliveries(),
          fetchOrderHistory(),
          fetchLateDeliveries(),
          fetchSystemAlerts(),
        ])
        if (!isMounted) return

        const formattedRevenue = formatCurrency(revenueData.totalRevenue)
        const monthLabel = formatMonthLabel(revenueData.month)

        const formattedOrdersCount = ordersData.newOrdersCount
        const lastMonthOrdersCount = ordersData.lastMonthOrdersCount

        const formattedCompletedDeliveries = completedDeliveriesData.completedDeliveries

        const lateDeliveriesCount = lateDeliveriesData.lateDeliveries
        const lateDeliveriesPercentage = lateDeliveriesData.lateDeliveriesPercentage
        const totalDeliveries = lateDeliveriesData.totalDeliveries

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
                : card.id === 'satisfaction'
                ? {
                    ...card,
                    value: `${lateDeliveriesCount}`,
                    change: `${lateDeliveriesPercentage}% of ${totalDeliveries} deliveries`,
                    hint: `Late deliveries this month (${monthLabel})`,
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

        // Set alerts from API
        setAlerts(alertsData)
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
                : card.id === 'satisfaction'
                ? {
                    ...card,
                    value: 'Unavailable',
                    change: 'Could not reach API',
                    hint: 'Please try again later.',
                  }
                  : card
          )
        )

        setAlerts([
          {
            id: 'alert-error',
            title: 'Data Loading Error',
            description: 'Could not fetch system alerts. Please try again later.',
            status: 'High',
            tone: 'warning',
          },
        ])
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
          <AlertsCard alerts={alerts} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard