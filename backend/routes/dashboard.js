const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

router.get('/revenue', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Get current month's revenue
    const currentMonthQuery = `
      SELECT COALESCE(SUM(total_price), 0) as revenue
      FROM orders
      WHERE YEAR(ordered_date) = YEAR(CURRENT_DATE)
      AND MONTH(ordered_date) = MONTH(CURRENT_DATE)
    `;

    // Get previous month's revenue
    const previousMonthQuery = `
      SELECT COALESCE(SUM(total_price), 0) as revenue
      FROM orders
      WHERE YEAR(ordered_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
      AND MONTH(ordered_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
    `;

    const [currentMonth] = await connection.query(currentMonthQuery);
    const [previousMonth] = await connection.query(previousMonthQuery);

    await connection.end();

    res.json({
      currentMonthRevenue: currentMonth[0].revenue,
      previousMonthRevenue: previousMonth[0].revenue
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

module.exports = router;
