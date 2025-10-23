import * as alertService from '../../services/alert.service.js';

/**
 * Get all alerts for a store
 */
export async function getAlerts(req, res, next) {
  try {
    const { storeId } = req.params;
    const { status = 'all' } = req.query; // 'all', 'unread', or 'read'
    
    const alerts = await alertService.getStoreAlerts(storeId, status);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
}

/**
 * Get unread alert count for a store
 */
export async function getUnreadCount(req, res, next) {
  try {
    const { storeId } = req.params;
    const count = await alertService.getUnreadAlertCount(storeId);
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

/**
 * Mark an alert as read
 */
export async function markAsRead(req, res, next) {
  try {
    const { alertId, storeId } = req.params;
    const result = await alertService.markAlertAsRead(alertId, storeId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Mark all alerts as read for a store
 */
export async function markAllAsRead(req, res, next) {
  try {
    const { storeId } = req.params;
    const result = await alertService.markAllAlertsAsRead(storeId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete an alert
 */
export async function deleteAlert(req, res, next) {
  try {
    const { alertId, storeId } = req.params;
    const result = await alertService.deleteAlert(alertId, storeId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
