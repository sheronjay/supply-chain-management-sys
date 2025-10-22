import express from 'express';
import * as mainStoresController from '../controllers/mainStores.controller.js';
import { authenticateUser, authorizeMainStoreManager } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Get all pending orders (any logged-in user)
router.get('/pending-orders', authenticateUser, mainStoresController.getPendingOrders);

// Get all train schedules with capacity (any logged-in user)
router.get('/train-schedules', authenticateUser, mainStoresController.getTrainSchedules);

// Process an order (only main store managers)
router.post('/process-order', authenticateUser, authorizeMainStoreManager, mainStoresController.processOrder);

// Get orders for a specific train schedule (any logged-in user)
router.get('/train-schedules/:tripId/orders', authenticateUser, mainStoresController.getScheduleOrders);

// Product management routes
router.get('/products', mainStoresController.getAllProducts);
router.post('/products', mainStoresController.addProduct);
router.put('/products', mainStoresController.updateProduct);
router.delete('/products', mainStoresController.deleteProduct);
router.put('/products/stock', mainStoresController.updateProductStock);

export default router;
