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
