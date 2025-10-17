import pool from '../src/db/pool.js';

/**
 * Get all orders with status 'TRAIN' for a specific store
 */
export async function getStoreOrders(storeId) {
    const [rows] = await pool.query(
        `SELECT 
            o.order_id,
            o.customer_id,
            o.store_id,
            o.sub_city_id,
            o.ordered_date,
            o.total_price,
            o.status,
            c.name as customer_name,
            c.email as customer_email,
            c.phone_number as customer_phone,
            sc.sub_city_name,
            s.city as store_city,
            GROUP_CONCAT(
                CONCAT(p.product_name, ' (', oi.quantity, 'x)')
                SEPARATOR ', '
            ) as items_summary,
            COUNT(DISTINCT oi.product_id) as total_items,
            SUM(oi.quantity * oi.item_capacity) as total_capacity_required
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
        LEFT JOIN stores s ON o.store_id = s.store_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.store_id = ? AND o.status = 'TRAIN'
        GROUP BY o.order_id, o.customer_id, o.store_id, o.sub_city_id, 
                 o.ordered_date, o.total_price, o.status,
                 c.name, c.email, c.phone_number, 
                 sc.sub_city_name, s.city
        ORDER BY o.ordered_date DESC`,
        [storeId]
    );
    return rows;
}

/**
 * Get all orders with status 'IN-STORE' for a specific store (inventory)
 */
export async function getStoreInventory(storeId) {
    const [rows] = await pool.query(
        `SELECT 
            o.order_id,
            o.customer_id,
            o.store_id,
            o.sub_city_id,
            o.ordered_date,
            o.total_price,
            o.status,
            c.name as customer_name,
            c.email as customer_email,
            c.phone_number as customer_phone,
            sc.sub_city_name,
            s.city as store_city,
            GROUP_CONCAT(
                CONCAT(p.product_name, ' (', oi.quantity, 'x)')
                SEPARATOR ', '
            ) as items_summary,
            COUNT(DISTINCT oi.product_id) as total_items,
            SUM(oi.quantity * oi.item_capacity) as total_capacity_required
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
        LEFT JOIN stores s ON o.store_id = s.store_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.store_id = ? AND o.status = 'IN-STORE'
        GROUP BY o.order_id, o.customer_id, o.store_id, o.sub_city_id, 
                 o.ordered_date, o.total_price, o.status,
                 c.name, c.email, c.phone_number, 
                 sc.sub_city_name, s.city
        ORDER BY o.ordered_date DESC`,
        [storeId]
    );
    return rows;
}

/**
 * Accept an order - update status from 'TRAIN' to 'IN-STORE'
 */
export async function acceptOrder(orderId, managerId) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // First, check if order exists and has status 'TRAIN'
        const [orders] = await connection.query(
            'SELECT order_id, status, store_id FROM orders WHERE order_id = ?',
            [orderId]
        );
        
        if (orders.length === 0) {
            throw new Error('Order not found');
        }
        
        if (orders[0].status !== 'TRAIN') {
            throw new Error(`Order cannot be accepted. Current status: ${orders[0].status}`);
        }
        
        // Update order status to 'IN-STORE'
        await connection.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            ['IN-STORE', orderId]
        );
        
        await connection.commit();
        
        return {
            success: true,
            message: 'Order accepted successfully',
            orderId,
            newStatus: 'IN-STORE',
            managerId
        };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

/**
 * Get all trucks for a specific store
 */
export async function getTrucks(storeId) {
    const [rows] = await pool.query(
        `SELECT 
            truck_id,
            store_id,
            reg_number,
            capacity,
            used_hours,
            availability
        FROM trucks
        WHERE store_id = ? AND availability = 1
        ORDER BY reg_number`,
        [storeId]
    );
    return rows;
}

/**
 * Get all drivers (delivery employees with designation 'Driver') for a specific store
 * Includes working_hours to check if > 40 hours
 */
export async function getDrivers(storeId) {
    const [rows] = await pool.query(
        `SELECT 
            u.user_id,
            u.name,
            u.designation,
            de.working_hours,
            de.availability,
            CASE WHEN de.working_hours >= 40 THEN 0 ELSE 1 END as can_assign
        FROM users u
        INNER JOIN delivery_employees de ON u.user_id = de.user_id
        WHERE u.store_id = ? 
        AND u.designation = 'Driver'
        AND u.is_employed = 1
        ORDER BY u.name`,
        [storeId]
    );
    return rows;
}

/**
 * Get all assistants (delivery employees with designation 'Assistant') for a specific store
 * Includes working_hours to check if > 40 hours
 */
export async function getAssistants(storeId) {
    const [rows] = await pool.query(
        `SELECT 
            u.user_id,
            u.name,
            u.designation,
            de.working_hours,
            de.availability,
            CASE WHEN de.working_hours >= 40 THEN 0 ELSE 1 END as can_assign
        FROM users u
        INNER JOIN delivery_employees de ON u.user_id = de.user_id
        WHERE u.store_id = ? 
        AND u.designation = 'Assistant'
        AND u.is_employed = 1
        ORDER BY u.name`,
        [storeId]
    );
    return rows;
}

/**
 * Assign an order to a truck with driver and assistant
 * Updates the order with truck assignment and changes status to 'TRUCK'
 */
export async function assignOrderToTruck(orderId, truckId, driverId, assistantId) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Check if order exists and has status 'IN-STORE'
        const [orders] = await connection.query(
            'SELECT order_id, status FROM orders WHERE order_id = ?',
            [orderId]
        );
        
        if (orders.length === 0) {
            throw new Error('Order not found');
        }
        
        if (orders[0].status !== 'IN-STORE') {
            throw new Error(`Order cannot be assigned. Current status: ${orders[0].status}`);
        }

        // Check if driver has worked more than 40 hours
        const [drivers] = await connection.query(
            'SELECT working_hours FROM delivery_employees WHERE user_id = ?',
            [driverId]
        );
        
        if (drivers.length === 0) {
            throw new Error('Driver not found');
        }
        
        if (drivers[0].working_hours >= 40) {
            throw new Error('Driver has already worked 40 or more hours');
        }

        // Check if assistant has worked more than 40 hours
        const [assistants] = await connection.query(
            'SELECT working_hours FROM delivery_employees WHERE user_id = ?',
            [assistantId]
        );
        
        if (assistants.length === 0) {
            throw new Error('Assistant not found');
        }
        
        if (assistants[0].working_hours >= 40) {
            throw new Error('Assistant has already worked 40 or more hours');
        }
        
        // Update order with truck, driver, assistant and change status to 'TRUCK'
        await connection.query(
            `UPDATE orders 
             SET truck_id = ?, driver_id = ?, assistant_id = ?, status = 'TRUCK' 
             WHERE order_id = ?`,
            [truckId, driverId, assistantId, orderId]
        );
        
        await connection.commit();
        
        return {
            success: true,
            message: 'Order assigned to truck successfully',
            orderId,
            truckId,
            driverId,
            assistantId,
            newStatus: 'TRUCK'
        };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

