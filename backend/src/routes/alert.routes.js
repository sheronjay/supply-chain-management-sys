import express from 'express';
import * as alertController from '../controllers/alert.controller.js';
import { authenticateUser, authorizeStoreManager } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Get all alerts for a store (with optional status filter)
router.get('/:storeId', authenticateUser, authorizeStoreManager, alertController.getAlerts);

// Get unread alert count for a store
router.get('/:storeId/count', authenticateUser, authorizeStoreManager, alertController.getUnreadCount);

// Mark a specific alert as read
router.patch('/:storeId/:alertId/read', authenticateUser, authorizeStoreManager, alertController.markAsRead);

// Mark all alerts as read for a store
router.patch('/:storeId/read-all', authenticateUser, authorizeStoreManager, alertController.markAllAsRead);

// Delete an alert
router.delete('/:storeId/:alertId', authenticateUser, authorizeStoreManager, alertController.deleteAlert);

export default router;
