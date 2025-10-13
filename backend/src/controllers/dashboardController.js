const pool = require('../db/pool')

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

    const totalRevenue = Number(rows[0]?.totalRevenue || 0)

    res.json({
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalRevenue,
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

    const [rows] = await pool.query(
      'SELECT COUNT(*) AS completedDeliveries FROM orders WHERE YEAR(ordered_date) = ? AND MONTH(ordered_date) = ? AND status = "DELIVERED"',
      [year, month]
    )

    const completedDeliveries = Number(rows[0]?.completedDeliveries || 0)
    res.json({ completedDeliveries })
  } catch (error) {
    console.error('Failed to load completed deliveries', error)
    res.status(500).json({ message: 'Unable to load completed deliveries' })
  }
}


module.exports = {
  getMonthlyRevenue,
  getNewOrdersCount,
  getCompletedDeliveries,
}