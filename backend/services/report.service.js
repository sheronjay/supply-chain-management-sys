import pool from '../src/db/pool.js';
import { validateDates, validateQuarterYear, formatDate } from '../utils/reportValidation.js';

/**
 * Get all orders report with filters
 */
export const getOrdersReport = async (startDate, endDate, storeId = null) => {
  try {
    const { start, end } = validateDates(startDate, endDate);

    let query = `
      SELECT 
        o.order_id,
        o.ordered_date,
        c.name as customer_name,
        c.email as customer_email,
        s.city as store,
        sc.sub_city_name as delivery_location,
        o.status,
        o.total_price,
        GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') as products
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN stores s ON o.store_id = s.store_id
      LEFT JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.ordered_date BETWEEN ? AND ?
    `;

    const params = [formatDate(start), formatDate(end)];
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }

    query += ' GROUP BY o.order_id ORDER BY o.ordered_date DESC, o.order_id DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get report summary statistics
 */
export const getReportSummary = async (startDate, endDate, storeId = null) => {
  try {
    const { start, end } = validateDates(startDate, endDate);

    let query = `
      SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as total_customers,
        SUM(o.total_price) as total_revenue,
        AVG(o.total_price) as avg_order_value,
        COUNT(DISTINCT CASE WHEN o.status = 'DELIVERED' THEN o.order_id END) as delivered_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'SCHEDULED' THEN o.order_id END) as scheduled_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'PENDING' THEN o.order_id END) as pending_orders
      FROM orders o
      WHERE o.ordered_date BETWEEN ? AND ?
    `;

    const params = [formatDate(start), formatDate(end)];
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || {};
  } catch (error) {
    throw error;
  }
};

/**
 * Quarterly Sales Report (value + volume)
 */
export const getQuarterlySales = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        CONCAT('Q', QUARTER(o.ordered_date), ' ', YEAR(o.ordered_date)) AS quarter,
        COUNT(DISTINCT o.order_id) as order_count,
        SUM(o.total_price) as total_sales,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        AVG(o.total_price) as avg_order_value
      FROM orders o
      GROUP BY YEAR(o.ordered_date), QUARTER(o.ordered_date)
      ORDER BY YEAR(o.ordered_date) DESC, QUARTER(o.ordered_date) DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Most Ordered Items per Quarter
 */
export const getTopOrderedItems = async (quarter, year) => {
  try {
    const { quarterNum, yearNum } = validateQuarterYear(quarter, year);

    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.product_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.unit_price) as total_revenue,
        COUNT(DISTINCT o.order_id) as order_count
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE QUARTER(o.ordered_date) = ? AND YEAR(o.ordered_date) = ?
      GROUP BY p.product_id, p.product_name
      ORDER BY total_quantity DESC
      LIMIT 10
    `, [quarterNum, yearNum]);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * City-wise and route-wise sales breakdown
 */
export const getCityRouteSales = async (startDate, endDate) => {
  try {
    const { start, end } = validateDates(startDate, endDate);

    const [rows] = await pool.query(`
      SELECT 
        s.city,
        sc.sub_city_name as route,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(o.total_price) as total_sales,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        AVG(o.total_price) as avg_order_value
      FROM orders o
      JOIN stores s ON o.store_id = s.store_id
      JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      WHERE o.ordered_date BETWEEN ? AND ?
      GROUP BY s.city, sc.sub_city_name
      ORDER BY s.city, total_sales DESC
    `, [formatDate(start), formatDate(end)]);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Driver working hours report
 */
export const getDriverWorkingHours = async (startDate, endDate) => {
  try {
    const { start, end } = validateDates(startDate, endDate);

    const [rows] = await pool.query(`
      SELECT 
        d.driver_id,
        d.name as driver_name,
        COUNT(DISTINCT o.order_id) as total_deliveries,
        SUM(TIMESTAMPDIFF(HOUR, o.delivery_start_time, o.delivery_end_time)) as total_hours,
        COUNT(DISTINCT DATE(o.ordered_date)) as days_worked,
        AVG(TIMESTAMPDIFF(MINUTE, o.delivery_start_time, o.delivery_end_time)) as avg_delivery_time
      FROM orders o
      JOIN drivers d ON o.driver_id = d.driver_id
      WHERE o.ordered_date BETWEEN ? AND ?
        AND o.delivery_start_time IS NOT NULL 
        AND o.delivery_end_time IS NOT NULL
      GROUP BY d.driver_id, d.name
      ORDER BY total_deliveries DESC
    `, [formatDate(start), formatDate(end)]);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Truck usage analysis per month
 */
export const getTruckUsageAnalysis = async (month, year) => {
  try {
    if (!month || !year) throw new Error('Month and year are required');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const [rows] = await pool.query(`
      SELECT 
        t.truck_id,
        t.vehicle_number,
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT DATE(o.ordered_date)) as days_used,
        SUM(o.total_price) as total_revenue,
        AVG(TIMESTAMPDIFF(MINUTE, o.delivery_start_time, o.delivery_end_time)) as avg_delivery_time,
        COUNT(DISTINCT o.driver_id) as different_drivers
      FROM orders o
      JOIN trucks t ON o.truck_id = t.truck_id
      WHERE MONTH(o.ordered_date) = ? AND YEAR(o.ordered_date) = ?
      GROUP BY t.truck_id, t.vehicle_number
      ORDER BY total_orders DESC
    `, [monthNum, yearNum]);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Customer order history with delivery details
 */
export const getCustomerOrderHistory = async (customerId, startDate, endDate) => {
  try {
    if (!customerId) throw new Error('Customer ID is required');
    const { start, end } = validateDates(startDate, endDate);

    const [rows] = await pool.query(`
      SELECT 
        o.order_id,
        o.ordered_date,
        o.delivery_start_time,
        o.delivery_end_time,
        o.status,
        o.total_price,
        s.city as store_city,
        sc.sub_city_name as delivery_location,
        d.name as driver_name,
        t.vehicle_number,
        GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, ' x $', oi.unit_price, ')') SEPARATOR ', ') as products
      FROM orders o
      JOIN stores s ON o.store_id = s.store_id
      JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      LEFT JOIN drivers d ON o.driver_id = d.driver_id
      LEFT JOIN trucks t ON o.truck_id = t.truck_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = ? 
        AND o.ordered_date BETWEEN ? AND ?
      GROUP BY o.order_id
      ORDER BY o.ordered_date DESC
    `, [customerId, formatDate(start), formatDate(end)]);
    return rows;
  } catch (error) {
    throw error;
  }
};
