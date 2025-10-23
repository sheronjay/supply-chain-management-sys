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
 * Get quarterly sales report by value (revenue)
 */
export const getQuarterlySalesValue = async (year, storeId = null) => {
  try {
    let query = `
      SELECT 
        QUARTER(o.ordered_date) as quarter,
        YEAR(o.ordered_date) as year,
        SUM(o.total_price) as total_revenue,
        COUNT(DISTINCT o.order_id) as order_count
      FROM orders o
      WHERE YEAR(o.ordered_date) = ?
    `;
    
    const params = [year];
    
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }
    
    query += ' GROUP BY QUARTER(o.ordered_date), YEAR(o.ordered_date) ORDER BY quarter';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get quarterly sales report by volume (quantity)
 */
export const getQuarterlySalesVolume = async (year, storeId = null) => {
  try {
    let query = `
      SELECT 
        QUARTER(o.ordered_date) as quarter,
        YEAR(o.ordered_date) as year,
        SUM(oi.quantity) as total_quantity,
        COUNT(DISTINCT o.order_id) as order_count
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE YEAR(o.ordered_date) = ?
    `;
    
    const params = [year];
    
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }
    
    query += ' GROUP BY QUARTER(o.ordered_date), YEAR(o.ordered_date) ORDER BY quarter';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get most ordered items in a given quarter
 */
export const getMostOrderedItems = async (year, quarter, storeId = null) => {
  try {
    let query = `
      SELECT 
        p.product_id,
        p.product_name,
        SUM(oi.quantity) as total_quantity,
        COUNT(DISTINCT o.order_id) as order_count,
        SUM(oi.quantity * oi.unit_price) as total_revenue
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE YEAR(o.ordered_date) = ? 
      AND QUARTER(o.ordered_date) = ?
    `;
    
    const params = [year, quarter];
    
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }
    
    query += ' GROUP BY p.product_id, p.product_name ORDER BY total_quantity DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get driver and assistant working hours report
 */
export const getWorkingHoursReport = async (startDate, endDate, storeId = null) => {
  try {
    let query = `
      SELECT 
        u.user_id,
        u.name,
        u.designation,
        u.store_id,
        s.city as store_city,
        COALESCE(SUM(dwh.hours_worked), 0) as total_hours_worked
      FROM users u
      LEFT JOIN delivery_employees de ON u.user_id = de.user_id
      LEFT JOIN stores s ON u.store_id = s.store_id
      LEFT JOIN driver_working_hours dwh ON u.user_id = dwh.driver_id 
        AND dwh.week_start_date BETWEEN ? AND ?
      WHERE u.designation IN ('Driver', 'Assistant')
      AND u.is_employed = 1
    `;
    
    const params = [startDate, endDate];
    
    if (storeId) {
      query += ' AND u.store_id = ?';
      params.push(storeId);
    }
    
    query += ' GROUP BY u.user_id, u.name, u.designation, u.store_id, s.city ORDER BY u.designation, u.name';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get truck usage analysis per month
 */
export const getTruckUsageReport = async (year, month = null, storeId = null) => {
  try {
    let query = `
      SELECT 
        t.truck_id,
        t.reg_number,
        t.store_id,
        s.city as store_city,
        t.capacity,
        t.used_hours,
        COUNT(DISTINCT o.order_id) as total_deliveries
      FROM trucks t
      LEFT JOIN stores s ON t.store_id = s.store_id
      LEFT JOIN orders o ON t.truck_id = o.truck_id 
        AND YEAR(o.ordered_date) = ?
    `;
    
    const params = [year];
    
    if (month) {
      query += ' AND MONTH(o.ordered_date) = ?';
      params.push(month);
    }
    
    if (storeId) {
      query += ' AND t.store_id = ?';
      params.push(storeId);
    }
    
    query += ' GROUP BY t.truck_id, t.reg_number, t.store_id, s.city, t.capacity, t.used_hours ORDER BY t.truck_id';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get customer order history with details
 */
export const getCustomerOrderHistory = async (customerId = null, startDate = null, endDate = null, storeId = null) => {
  try {
    let query = `
      SELECT 
        c.customer_id,
        c.name as customer_name,
        c.email,
        c.phone_number,
        c.city as customer_city,
        o.order_id,
        o.ordered_date,
        o.status,
        o.total_price,
        s.city as store,
        sc.sub_city_name as delivery_location,
        GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') as products
      FROM customers c
      LEFT JOIN orders o ON c.customer_id = o.customer_id
      LEFT JOIN stores s ON o.store_id = s.store_id
      LEFT JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (customerId) {
      query += ' AND c.customer_id = ?';
      params.push(customerId);
    }
    
    if (startDate && endDate) {
      query += ' AND o.ordered_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    if (storeId) {
      query += ' AND o.store_id = ?';
      params.push(storeId);
    }
    
    query += ' GROUP BY c.customer_id, c.name, c.email, c.phone_number, c.city, o.order_id, o.ordered_date, o.status, o.total_price, s.city, sc.sub_city_name ORDER BY c.name, o.ordered_date DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};
