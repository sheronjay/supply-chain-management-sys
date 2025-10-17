import * as driverService from '../../services/driver.service.js';

/**
 * Get all orders assigned to a specific driver
 */
export async function getDriverOrders(req, res, next) {
    try {
        const driverId = req.params.driverId;
        const orders = await driverService.getDriverOrders(driverId);
        res.json(orders);
    } catch (err) {
        next(err);
    }
}

/**
 * Get driver's details including working hours
 */
export async function getDriverDetails(req, res, next) {
    try {
        const driverId = req.params.driverId;
        const details = await driverService.getDriverDetails(driverId);
        res.json(details);
    } catch (err) {
        next(err);
    }
}

/**
 * Mark an order as delivered
 */
export async function markOrderAsDelivered(req, res, next) {
    try {
        const { orderId } = req.params;
        const { driverId } = req.body;
        
        if (!driverId) {
            return res.status(400).json({ 
                error: 'Missing required field: driverId' 
            });
        }
        
        const result = await driverService.markOrderAsDelivered(orderId, driverId);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

/**
 * Update driver's working hours
 */
export async function updateWorkingHours(req, res, next) {
    try {
        const { driverId } = req.params;
        const { workingHours } = req.body;
        
        if (workingHours === undefined || workingHours === null) {
            return res.status(400).json({ 
                error: 'Missing required field: workingHours' 
            });
        }
        
        const result = await driverService.updateWorkingHours(driverId, workingHours);
        res.json(result);
    } catch (err) {
        next(err);
    }
}
