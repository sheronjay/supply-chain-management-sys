import pool from '../db/pool.js';

const parseMonthParam = (rawMonth) => {
  if (!rawMonth) {
    return null
  }

  const match = rawMonth.match(/^(\d{4})-(\d{2})$/)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])

  if (month < 1 || month > 12) {
    return null
  }

  return { year, month }
}

const getMonthFromRequest = (req) => {
  const parsed = parseMonthParam(req.query.month)
  if (parsed) {
    return parsed
  }

  const now = new Date()
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 }
}

const getMonthlyRevenue = async (req, res) => {
  try {
    const { year, month } = getMonthFromRequest(req)

    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(total_price), 0) AS totalRevenue
       FROM orders
       WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ?`,
      [year, month]
    )

    // Get last month's revenue for comparison
    const lastMonth = month === 1 ? 12 : month - 1
    const lastMonthYear = month === 1 ? year - 1 : year

    const [lastMonthRows] = await pool.query(
      `SELECT COALESCE(SUM(total_price), 0) AS totalRevenue
       FROM orders
       WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ?`,
      [lastMonthYear, lastMonth]
    )

    const totalRevenue = Number(rows[0]?.totalRevenue || 0)
    const lastMonthRevenue = Number(lastMonthRows[0]?.totalRevenue || 0)

    res.json({
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalRevenue,
      lastMonthRevenue,
    })
  } catch (error) {
    console.error('Failed to load monthly revenue', error)
    res.status(500).json({ message: 'Unable to load monthly revenue' })
  }
}

const getNewOrdersCount = async (req, res) => {
  try {
    const {year, month} = getMonthFromRequest(req)
    
    const [rows] = await pool.query(
      'SELECT  COUNT(*) AS newOrdersCount FROM orders WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ?',
      [year, month]
    )
    const [lastMonthRows] = await pool.query(
      'SELECT  COUNT(*) AS lastMonthOrdersCount FROM orders WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ?',
      [year, month - 1]
    )


    const newOrdersCount = Number(rows[0]?.newOrdersCount || 0)
    const lastMonthOrdersCount = Number(lastMonthRows[0]?.lastMonthOrdersCount || 0)

    res.json({
      newOrdersCount,
      lastMonthOrdersCount,
    })

  } catch (error) {
    console.error('Failed to load new orders count', error)
    res.status(500).json({ message: 'Unable to load new orders count' })
  }
}

const getCompletedDeliveries = async (req, res) => {
  try {
    const {year, month} = getMonthFromRequest(req)

    // Get completed deliveries count
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS completedDeliveries FROM orders WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ? AND status = "DELIVERED"',
      [year, month]
    )

    // Get total orders for the month to calculate percentage
    const [totalRows] = await pool.query(
      'SELECT COUNT(*) AS totalOrders FROM orders WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ?',
      [year, month]
    )

    const completedDeliveries = Number(rows[0]?.completedDeliveries || 0)
    const totalOrders = Number(totalRows[0]?.totalOrders || 0)
    const deliveryPercentage = totalOrders > 0 
      ? ((completedDeliveries / totalOrders) * 100).toFixed(1)
      : 0

    res.json({ 
      completedDeliveries,
      totalOrders,
      deliveryPercentage
    })
  } catch (error) {
    console.error('Failed to load completed deliveries', error)
    res.status(500).json({ message: 'Unable to load completed deliveries' })
  }
}

const getOrderHistory = async (req, res) => {
  try{
    //FOR testing use a fixed date  
    const endDate = new Date('2025-10-27');
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    const [rows] = await pool.query(
      `SELECT
        DATE(ordered_date) AS orderDate,
        COUNT(*) AS orderCount,
        SUM(total_price) AS totalRevenue
      FROM orders
      WHERE ordered_date BETWEEN ? AND ?
      GROUP BY DATE(ordered_date)
      ORDER BY orderDate ASC`,
      [startDate, endDate]
    )

    const dateMap = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() +1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = { orderCount: 0, totalRevenue: 0 };
    }

    rows.forEach(row => {
      const dateStr = new Date(row.orderDate).toISOString().split('T')[0];
      dateMap[dateStr] = {
        orderCount: Number(row.orderCount),
        totalRevenue: Number(row.totalRevenue),
      };
    });

    const result = Object.entries(dateMap).map(([date, data]) => ({
      date,
      ...data
    }));
    
    res.json(result);

  } catch (error) {
    console.error('Failed to load order history', error)
    res.status(500).json({ error: 'Unable to load order history' })
  }
}

const getLateDeliveries = async (req, res) => {
  try {
    const { year, month } = getMonthFromRequest(req)

    // Query to get late deliveries count and percentage
    // An order is considered late if it's not DELIVERED and was placed more than 14 days ago
    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE 
          WHEN status != 'DELIVERED' AND DATEDIFF(CURRENT_DATE, ordered_date) > 14 THEN 1 
          ELSE 0 
        END) as lateDeliveries
      FROM orders
      WHERE YEAR(ordered_date) = ? 
        AND MONTH(ordered_date) = ?`,
      [year, month]
    )

    const totalOrders = Number(rows[0]?.totalOrders || 0)
    const lateDeliveries = Number(rows[0]?.lateDeliveries || 0)
    const lateDeliveriesPercentage = totalOrders > 0 
      ? ((lateDeliveries / totalOrders) * 100).toFixed(1)
      : 0

    res.json({
      lateDeliveries,
      totalOrders,
      lateDeliveriesPercentage,
      month: `${year}-${String(month).padStart(2, '0')}`
    })
  } catch (error) {
    console.error('Failed to load late deliveries', error)
    res.status(500).json({ message: 'Unable to load late deliveries' })
  }
}


const getSystemAlerts = async (req, res) => {
  try {
    const alerts = []

    // Alert 1: Late Deliveries (orders not delivered and placed more than 14 days ago)
    const [lateDeliveriesRows] = await pool.query(
      `SELECT COUNT(*) as count
       FROM orders
       WHERE status != 'DELIVERED'
         AND DATEDIFF(CURRENT_DATE, ordered_date) > 14
         AND MONTH(ordered_date) = MONTH(CURRENT_DATE())
         AND YEAR(ordered_date) = YEAR(CURRENT_DATE())`
    )
    
    const lateDeliveriesCount = Number(lateDeliveriesRows[0]?.count || 0)
    if (lateDeliveriesCount > 0) {
      alerts.push({
        id: 'alert-late-deliveries',
        title: 'Late Deliveries Detected',
        description: `${lateDeliveriesCount} order${lateDeliveriesCount > 1 ? 's' : ''} exceeded the 14-day SLA window this month.`,
        status: lateDeliveriesCount > 5 ? 'High' : 'Medium',
        tone: lateDeliveriesCount > 5 ? 'warning' : 'caution',
      })
    }

    // Alert 2: Low Stock Products (stock below 20% of quarterly order average)
    const [lowStockRows] = await pool.query(
      `SELECT product_id, product_name, stock_quantity, order_per_quarter
       FROM products
       WHERE stock_quantity < (order_per_quarter * 0.2)
       ORDER BY (stock_quantity / order_per_quarter) ASC
       LIMIT 3`
    )

    if (lowStockRows.length > 0) {
      const productNames = lowStockRows.map(p => p.product_name).join(', ')
      alerts.push({
        id: 'alert-low-stock',
        title: 'Low Inventory Alert',
        description: `${lowStockRows.length} product${lowStockRows.length > 1 ? 's' : ''} running low: ${productNames}.`,
        status: lowStockRows.length > 2 ? 'High' : 'Medium',
        tone: lowStockRows.length > 2 ? 'warning' : 'caution',
      })
    }

    // Alert 3: Pending Orders (orders that are PENDING but not SCHEDULED)
    const [pendingOrdersRows] = await pool.query(
      `SELECT COUNT(*) as count
       FROM orders
       WHERE status = 'PENDING'
         AND DATEDIFF(CURRENT_DATE(), ordered_date) > 2`
    )

    const pendingOrdersCount = Number(pendingOrdersRows[0]?.count || 0)
    if (pendingOrdersCount > 0) {
      alerts.push({
        id: 'alert-pending-orders',
        title: 'Pending Orders Require Attention',
        description: `${pendingOrdersCount} order${pendingOrdersCount > 1 ? 's have' : ' has'} been unscheduled for more than 2 days.`,
        status: pendingOrdersCount > 10 ? 'High' : 'Medium',
        tone: pendingOrdersCount > 10 ? 'warning' : 'caution',
      })
    }

    // Alert 4: Truck Maintenance (trucks with high usage hours)
    const [highUsageTrucksRows] = await pool.query(
      `SELECT truck_id, reg_number, used_hours
       FROM trucks
       WHERE used_hours > 500 AND availability = 1
       ORDER BY used_hours DESC
       LIMIT 2`
    )

    if (highUsageTrucksRows.length > 0) {
      const truckIds = highUsageTrucksRows.map(t => t.reg_number).join(', ')
      alerts.push({
        id: 'alert-truck-maintenance',
        title: 'Fleet Maintenance Due',
        description: `Vehicle${highUsageTrucksRows.length > 1 ? 's' : ''} ${truckIds} ${highUsageTrucksRows.length > 1 ? 'have' : 'has'} high usage hours and may need inspection.`,
        status: 'Low',
        tone: 'positive',
      })
    }

    // If no alerts, send a success message
    if (alerts.length === 0) {
      alerts.push({
        id: 'alert-all-clear',
        title: 'All Systems Normal',
        description: 'No critical issues detected. Operations running smoothly.',
        status: 'Info',
        tone: 'positive',
      })
    }

    res.json(alerts)
  } catch (error) {
    console.error('Failed to load system alerts', error)
    res.status(500).json({ message: 'Unable to load system alerts' })
  }
}

export {
  getMonthlyRevenue,
  getNewOrdersCount,
  getCompletedDeliveries,
  getOrderHistory,
  getLateDeliveries,
  getSystemAlerts,
};