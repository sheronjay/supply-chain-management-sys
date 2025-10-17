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
