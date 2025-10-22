import pool from '../src/db/pool.js';
import { validateDates, validateQuarterYear, formatDate } from '../utils/reportValidation.js';

/**
 * Validate date parameters
 */
const validateDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error('Start date and end date are required');
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }
  
  if (start > end) {
    throw new Error('Start date must be before end date');
  }
  
  return { start, end };
};

/**
 * Get all orders report with filters
 */
export const getOrdersReport = async (startDate, endDate, storeId = null) => {
  try {
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

    const params = [startDate, endDate];
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

    const params = [startDate, endDate];
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 *  Quarterly Sales Report (value + volume)
 */
export const getQuarterlySales = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        CONCAT('Q', QUARTER(o.ordered_date), ' ', YEAR(o.ordered_date)) AS quarter,
        SUM(o.total_price) AS total_sales_value,
        COUNT(o.order_id) AS total_sales_volume
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
 *  Most Ordered Items per Quarter
 */
export const getTopOrderedItems = async (quarter, year) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.product_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.unit_price) as total_value
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE QUARTER(o.ordered_date) = ? AND YEAR(o.ordered_date) = ?
      GROUP BY p.product_id
      ORDER BY total_quantity DESC
      LIMIT 10
    `, [quarter, year]);
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
    const [rows] = await pool.query(`
      SELECT 
        s.city,
        sc.sub_city_name as route,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(o.total_price) as total_sales,
        COUNT(DISTINCT o.customer_id) as unique_customers
      FROM orders o
      JOIN stores s ON o.store_id = s.store_id
      JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      WHERE o.ordered_date BETWEEN ? AND ?
      GROUP BY s.city, sc.sub_city_name
      ORDER BY s.city, total_sales DESC
    `, [startDate, endDate]);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Driver and assistant working hours report
 */
export const getDriverWorkingHours = async (startDate, endDate) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.driver_id,
        d.name as driver_name,
        COUNT(DISTINCT o.order_id) as total_deliveries,
        SUM(TIMESTAMPDIFF(HOUR, o.delivery_start_time, o.delivery_end_time)) as total_hours,
        COUNT(DISTINCT DATE(o.ordered_date)) as days_worked
      FROM orders o
      JOIN drivers d ON o.driver_id = d.driver_id
      WHERE o.ordered_date BETWEEN ? AND ?
      GROUP BY d.driver_id
      ORDER BY total_hours DESC
    `, [startDate, endDate]);
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
    const [rows] = await pool.query(`
      SELECT 
        t.truck_id,
        t.vehicle_number,
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT DATE(o.ordered_date)) as days_used,
        SUM(o.total_price) as total_revenue_generated,
        AVG(TIMESTAMPDIFF(HOUR, o.delivery_start_time, o.delivery_end_time)) as avg_delivery_time
      FROM orders o
      JOIN trucks t ON o.truck_id = t.truck_id
      WHERE MONTH(o.ordered_date) = ? AND YEAR(o.ordered_date) = ?
      GROUP BY t.truck_id
      ORDER BY total_orders DESC
    `, [month, year]);
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
        GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') as products
      FROM orders o
      JOIN stores s ON o.store_id = s.store_id
      JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      LEFT JOIN drivers d ON o.driver_id = d.driver_id
      LEFT JOIN trucks t ON o.truck_id = t.truck_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = ? AND o.ordered_date BETWEEN ? AND ?
      GROUP BY o.order_id
      ORDER BY o.ordered_date DESC
    `, [customerId, startDate, endDate]);
    return rows;
  } catch (error) {
    throw error;
  }
};
      SELECT 
        p.product_name,
        SUM(oi.quantity) AS total_quantity,
        SUM(oi.quantity * oi.unit_price) AS total_sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE QUARTER(o.ordered_date) = ? AND YEAR(o.ordered_date) = ?
      GROUP BY p.product_name
      ORDER BY total_quantity DESC
      LIMIT 10
    `,
      [quarter, year]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 *  City-wise and Route-wise Sales Breakdown
 */
export const getCityRouteSales = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.city AS city,
        tr.end_location AS route,
        SUM(o.total_price) AS total_sales,
        COUNT(o.order_id) AS total_orders
      FROM orders o
      JOIN stores s ON o.store_id = s.store_id
      JOIN truck_routes tr ON o.route_id = tr.route_id
      GROUP BY s.city, tr.end_location
      ORDER BY s.city ASC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 *  Driver and Assistant Working Hours Report
 */
export const getDriverAssistantHours = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.employee_name AS driver_name,
        a.employee_name AS assistant_name,
        tr.route_name,
        SUM(TIMESTAMPDIFF(HOUR, tr.departure_time, tr.arrival_time)) AS total_hours
      FROM truck_routes tr
      LEFT JOIN employees d ON tr.driver_id = d.employee_id
      LEFT JOIN employees a ON tr.assistant_id = a.employee_id
      GROUP BY d.employee_name, a.employee_name, tr.route_name
      ORDER BY total_hours DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 *  Truck Usage Analysis per Month
 */
export const getTruckUsagePerMonth = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.truck_id,
        t.truck_number,
        DATE_FORMAT(tr.departure_time, '%Y-%m') AS month,
        COUNT(DISTINCT tr.route_id) AS trips_completed,
        SUM(TIMESTAMPDIFF(HOUR, tr.departure_time, tr.arrival_time)) AS total_hours
      FROM trucks t
      LEFT JOIN truck_routes tr ON t.truck_id = tr.truck_id
      GROUP BY t.truck_id, month
      ORDER BY month DESC, trips_completed DESC
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * 6️⃣ Customer Order History with Delivery Details
 */
export const getCustomerOrderHistory = async (customerId) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        o.order_id,
        o.ordered_date,
        o.status,
        o.total_price,
        s.city AS store,
        tr.end_location AS delivery_route,
        tr.arrival_time,
        GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') AS products
      FROM orders o
      JOIN stores s ON o.store_id = s.store_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN truck_routes tr ON o.route_id = tr.route_id
      WHERE o.customer_id = ?
      GROUP BY o.order_id
      ORDER BY o.ordered_date DESC
    `,
      [customerId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};
