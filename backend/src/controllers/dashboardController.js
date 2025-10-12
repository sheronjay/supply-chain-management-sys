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

module.exports = {
  getMonthlyRevenue,
}