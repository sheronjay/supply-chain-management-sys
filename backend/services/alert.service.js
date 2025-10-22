import pool from '../src/db/pool.js';

/**
 * Get all alerts for a specific store
 * @param {string} storeId - The store ID
 * @param {string} status - Optional filter by status ('unread', 'read', or 'all')
 * @returns {Promise<Array>} Array of alerts
 */
export async function getStoreAlerts(storeId, status = 'all') {
  let query = `
    SELECT 
      a.alert_id,
      a.store_id,
      a.order_id,
      a.alert_type,
      a.title,
      a.message,
      a.status,
      a.created_at,
      s.city as store_city
    FROM store_manager_alerts a
    LEFT JOIN stores s ON a.store_id = s.store_id
    WHERE a.store_id = ?
  `;
  
  const params = [storeId];
  
  if (status !== 'all') {
    query += ' AND a.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY a.created_at DESC';
  
  const [rows] = await pool.query(query, params);
  return rows;
}

/**
 * Get unread alert count for a specific store
 * @param {string} storeId - The store ID
 * @returns {Promise<number>} Count of unread alerts
 */
export async function getUnreadAlertCount(storeId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count 
     FROM store_manager_alerts 
     WHERE store_id = ? AND status = 'unread'`,
    [storeId]
  );
  return rows[0]?.count || 0;
}

/**
 * Mark an alert as read
 * @param {number} alertId - The alert ID
 * @param {string} storeId - The store ID (for security check)
 * @returns {Promise<Object>} Result of the update
 */
export async function markAlertAsRead(alertId, storeId) {
  const [result] = await pool.query(
    `UPDATE store_manager_alerts 
     SET status = 'read' 
     WHERE alert_id = ? AND store_id = ?`,
    [alertId, storeId]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Alert not found or unauthorized');
  }
  
  return { success: true, message: 'Alert marked as read' };
}

/**
 * Mark all alerts as read for a store
 * @param {string} storeId - The store ID
 * @returns {Promise<Object>} Result of the update
 */
export async function markAllAlertsAsRead(storeId) {
  const [result] = await pool.query(
    `UPDATE store_manager_alerts 
     SET status = 'read' 
     WHERE store_id = ? AND status = 'unread'`,
    [storeId]
  );
  
  return { 
    success: true, 
    message: 'All alerts marked as read',
    count: result.affectedRows 
  };
}

/**
 * Delete an alert
 * @param {number} alertId - The alert ID
 * @param {string} storeId - The store ID (for security check)
 * @returns {Promise<Object>} Result of the deletion
 */
export async function deleteAlert(alertId, storeId) {
  const [result] = await pool.query(
    `DELETE FROM store_manager_alerts 
     WHERE alert_id = ? AND store_id = ?`,
    [alertId, storeId]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Alert not found or unauthorized');
  }
  
  return { success: true, message: 'Alert deleted' };
}
