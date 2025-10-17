import express from 'express';
import * as storeManagerController from '../controllers/storeManager.controller.js';

const router = express.Router();

// Get all orders with status 'TRAIN' for a store
router.get('/orders/:storeId?', storeManagerController.getStoreOrders);

// Get all orders with status 'IN-STORE' for a store (inventory)
router.get('/inventory/:storeId?', storeManagerController.getStoreInventory);

// Accept an order (update status from 'TRAIN' to 'IN-STORE')
router.patch('/orders/:orderId/accept', storeManagerController.acceptOrder);

// Get trucks for a store
router.get('/trucks/:storeId', storeManagerController.getTrucks);

// Get drivers for a store
router.get('/drivers/:storeId', storeManagerController.getDrivers);

// Get assistants for a store
router.get('/assistants/:storeId', storeManagerController.getAssistants);

// Get delivery employees with working hours
router.get('/delivery-employees/:storeId?', storeManagerController.getDeliveryEmployees);

// Assign order to truck with driver and assistant
router.post('/orders/:orderId/assign-truck', storeManagerController.assignOrderToTruck);

export default router;
