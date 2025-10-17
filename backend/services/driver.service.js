import pool from '../src/db/pool.js';

/**
 * Get all orders assigned to a specific driver
 */
export async function getDriverOrders(driverId) {
    const [rows] = await pool.query(
        `SELECT 
            o.order_id,
            o.customer_id,
            o.store_id,
            o.sub_city_id,
            o.ordered_date,
            o.total_price,
            o.status,
            o.truck_id,
            o.assistant_id,
            c.name as customer_name,
            c.email as customer_email,
            c.phone_number as customer_phone,
            c.city as customer_city,
            sc.sub_city_name,
            s.city as store_city,
            t.reg_number as truck_reg_number,
            u_assistant.name as assistant_name,
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
        LEFT JOIN trucks t ON o.truck_id = t.truck_id
        LEFT JOIN users u_assistant ON o.assistant_id = u_assistant.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.driver_id = ? AND o.status IN ('TRUCK', 'DELIVERED')
        GROUP BY o.order_id, o.customer_id, o.store_id, o.sub_city_id, 
                 o.ordered_date, o.total_price, o.status, o.truck_id, o.assistant_id,
                 c.name, c.email, c.phone_number, c.city,
                 sc.sub_city_name, s.city, t.reg_number, u_assistant.name
        ORDER BY 
            CASE o.status 
                WHEN 'TRUCK' THEN 1 
                WHEN 'DELIVERED' THEN 2 
                ELSE 3 
            END,
            o.ordered_date DESC`,
        [driverId]
    );
    return rows;
}

/**
 * Get driver's working hours and details
 */
export async function getDriverDetails(driverId) {
    const [rows] = await pool.query(
        `SELECT 
            u.user_id,
            u.name,
            u.designation,
            u.store_id,
            s.city as store_city,
            de.working_hours,
            de.availability
        FROM users u
        INNER JOIN delivery_employees de ON u.user_id = de.user_id
        LEFT JOIN stores s ON u.store_id = s.store_id
        WHERE u.user_id = ? AND u.designation = 'Driver'`,
        [driverId]
    );
    
    if (rows.length === 0) {
        throw new Error('Driver not found');
    }
    
    return rows[0];
}

/**
 * Mark an order as delivered
 */
export async function markOrderAsDelivered(orderId, driverId) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Verify the order belongs to this driver and has status 'TRUCK'
        const [orders] = await connection.query(
            'SELECT order_id, status, driver_id FROM orders WHERE order_id = ?',
            [orderId]
        );
        
        if (orders.length === 0) {
            throw new Error('Order not found');
        }
        
        if (orders[0].driver_id !== driverId) {
            throw new Error('This order is not assigned to you');
        }
        
        if (orders[0].status !== 'TRUCK') {
            throw new Error(`Order cannot be marked as delivered. Current status: ${orders[0].status}`);
        }
        
        // Update order status to 'DELIVERED'
        await connection.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            ['DELIVERED', orderId]
        );
        
        await connection.commit();
        
        return {
            success: true,
            message: 'Order marked as delivered successfully',
            orderId,
            newStatus: 'DELIVERED'
        };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

/**
 * Update driver's working hours
 */
export async function updateWorkingHours(driverId, workingHours) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Verify the driver exists
        const [drivers] = await connection.query(
            'SELECT user_id FROM delivery_employees WHERE user_id = ?',
            [driverId]
        );
        
        if (drivers.length === 0) {
            throw new Error('Driver not found in delivery employees');
        }
        
        // Validate working hours
        const hours = parseFloat(workingHours);
        if (isNaN(hours) || hours < 0) {
            throw new Error('Invalid working hours. Must be a positive number');
        }
        
        // Update working hours
        await connection.query(
            'UPDATE delivery_employees SET working_hours = ? WHERE user_id = ?',
            [hours, driverId]
        );
        
        await connection.commit();
        
        return {
            success: true,
            message: 'Working hours updated successfully',
            driverId,
            workingHours: hours
        };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}
