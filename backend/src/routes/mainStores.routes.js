import express from 'express';
import * as mainStoresController from '../controllers/mainStores.controller.js';

const router = express.Router();

// Get all pending orders
router.get('/pending-orders', mainStoresController.getPendingOrders);

// Get all train schedules with capacity
router.get('/train-schedules', mainStoresController.getTrainSchedules);

// Process an order (assign to train schedule)
router.post('/process-order', mainStoresController.processOrder);

// Get orders for a specific train schedule
router.get('/train-schedules/:tripId/orders', mainStoresController.getScheduleOrders);

// Product management routes
router.get('/products', mainStoresController.getAllProducts);
router.post('/products', mainStoresController.addProduct);
router.put('/products', mainStoresController.updateProduct);
router.delete('/products', mainStoresController.deleteProduct);
router.put('/products/stock', mainStoresController.updateProductStock);

export default router;
