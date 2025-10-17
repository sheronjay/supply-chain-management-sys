import * as storeManagerService from '../../services/storeManager.service.js';

/**
 * Get all orders for a specific store with status 'TRAIN'
 */
export async function getStoreOrders(req, res, next) {
    try {
        const storeId = req.params.storeId || 'ST-CMB-01'; // Default to CMB store
        const orders = await storeManagerService.getStoreOrders(storeId);
        res.json(orders);
    } catch (err) {
        next(err);
    }
}

/**
 * Get all orders for a specific store with status 'IN-STORE' (inventory)
 */
export async function getStoreInventory(req, res, next) {
    try {
        const storeId = req.params.storeId || 'ST-CMB-01'; // Default to CMB store
        const inventory = await storeManagerService.getStoreInventory(storeId);
        res.json(inventory);
    } catch (err) {
        next(err);
    }
}

/**
 * Accept an order - change status from 'TRAIN' to 'IN-STORE'
 */
export async function acceptOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        const { managerId = 'MGR-CMB-001' } = req.body; // Default CMB manager
        
        const result = await storeManagerService.acceptOrder(orderId, managerId);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

/**
 * Get all trucks for a store
 */
export async function getTrucks(req, res, next) {
    try {
        const { storeId } = req.params;
        const trucks = await storeManagerService.getTrucks(storeId);
        res.json(trucks);
    } catch (err) {
        next(err);
    }
}

/**
 * Get all drivers for a store
 */
export async function getDrivers(req, res, next) {
    try {
        const { storeId } = req.params;
        const drivers = await storeManagerService.getDrivers(storeId);
        res.json(drivers);
    } catch (err) {
        next(err);
    }
}

/**
 * Get all assistants for a store
 */
export async function getAssistants(req, res, next) {
    try {
        const { storeId } = req.params;
        const assistants = await storeManagerService.getAssistants(storeId);
        res.json(assistants);
    } catch (err) {
        next(err);
    }
}

/**
 * Assign an order to a truck with driver and assistant
 */
export async function assignOrderToTruck(req, res, next) {
    try {
        const { orderId } = req.params;
        const { truckId, driverId, assistantId } = req.body;
        
        if (!truckId || !driverId || !assistantId) {
            return res.status(400).json({ 
                error: 'Missing required fields: truckId, driverId, assistantId' 
            });
        }
        
        const result = await storeManagerService.assignOrderToTruck(
            orderId, 
            truckId, 
            driverId, 
            assistantId
        );
        res.json(result);
    } catch (err) {
        next(err);
    }
}
