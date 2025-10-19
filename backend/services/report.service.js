import pool from '../src/db/pool.js';

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
    const [rows] = await pool.query(
      `
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
