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
