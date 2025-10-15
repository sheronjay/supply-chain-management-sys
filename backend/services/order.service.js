import pool from '../src/db/pool.js';
import { v4 as uuidv4 } from 'uuid';

export async function listOrders() {
    const [rows] = await pool.query(`
        SELECT 
            o.*,
            c.name as customer_name,
            s.address as store_address,
            tr.end_location as route_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN stores s ON o.store_id = s.store_id
        LEFT JOIN truck_routes tr ON o.route_id = tr.route_id
        ORDER BY o.ordered_date DESC
    `);
    
    // Get items for each order
    const ordersWithItems = [];
    for (const order of rows) {
        const [items] = await pool.query(`
            SELECT oi.*, p.product_name, p.unit_price
            FROM order_items oi 
            LEFT JOIN products p ON oi.product_id = p.product_id 
            WHERE oi.order_id = ?
        `, [order.order_id]);
        
        ordersWithItems.push({
            id: order.order_id,
            customer: order.customer_name,
            customerId: order.customer_id,
            storeId: order.store_id,
            route: order.route_name || 'Unknown',
            deliveryDate: order.ordered_date,
            status: order.status,
            totalAmount: order.total_price,
            items: items.map(item => ({
                name: item.product_name,
                qty: item.quantity,
                price: item.unit_price,
                amount: item.quantity * item.unit_price
            }))
        });
    }
    
    return ordersWithItems;
}

export async function getOrderById(orderId) {
    const [orders] = await pool.query(`
        SELECT 
            o.*,
            c.name as customer_name,
            s.address as store_address,
            tr.end_location as route_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN stores s ON o.store_id = s.store_id
        LEFT JOIN truck_routes tr ON o.route_id = tr.route_id
        WHERE o.order_id = ?
    `, [orderId]);
    
    if (orders.length === 0) return null;
    
    const order = orders[0];
    const [items] = await pool.query(`
        SELECT oi.*, p.product_name, p.unit_price
        FROM order_items oi 
        LEFT JOIN products p ON oi.product_id = p.product_id 
        WHERE oi.order_id = ?
    `, [orderId]);
    
    return {
        id: order.order_id,
        customer: order.customer_name,
        customerId: order.customer_id,
        storeId: order.store_id,
        route: order.route_name || 'Unknown',
        deliveryDate: order.ordered_date,
        status: order.status,
        totalAmount: order.total_price,
        items: items.map(item => ({
            name: item.product_name,
            qty: item.quantity,
            price: item.unit_price,
            amount: item.quantity * item.unit_price
        }))
    };
}

export async function getOrdersByUser(userId) {
    const [orders] = await pool.query(`
        SELECT 
            o.*,
            c.name as customer_name,
            s.address as store_address,
            tr.end_location as route_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN stores s ON o.store_id = s.store_id
        LEFT JOIN truck_routes tr ON o.route_id = tr.route_id
        WHERE o.customer_id = ?
        ORDER BY o.ordered_date DESC
    `, [userId]);

    const results = [];
    for (const order of orders) {
        const [items] = await pool.query(`
            SELECT oi.*, p.product_name, p.unit_price
            FROM order_items oi 
            LEFT JOIN products p ON oi.product_id = p.product_id 
            WHERE oi.order_id = ?
        `, [order.order_id]);
        
        results.push({
            id: order.order_id,
            customer: order.customer_name,
            customerId: order.customer_id,
            storeId: order.store_id,
            route: order.route_name || 'Unknown',
            deliveryDate: order.ordered_date,
            status: order.status,
            totalAmount: order.total_price,
            items: items.map(item => ({
                name: item.product_name,
                qty: item.quantity,
                price: item.unit_price,
                amount: item.quantity * item.unit_price
            }))
        });
    }

    return results;
}

export async function createOrder(payload) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        console.log('Creating order with payload:', payload);
        
        // First, create or find customer
        let customerId = payload.customerId;
        if (!customerId && payload.customerName) {
            // Check if customer exists
            const [existingCustomers] = await conn.query(
                'SELECT customer_id FROM customers WHERE name = ?',
                [payload.customerName]
            );
            
            if (existingCustomers.length > 0) {
                customerId = existingCustomers[0].customer_id;
            } else {
                // Create new customer
                customerId = uuidv4();
                await conn.query(
                    'INSERT INTO customers (customer_id, name, email, phone_number, city) VALUES (?, ?, ?, ?, ?)',
                    [customerId, payload.customerName, payload.email || null, payload.phone || null, payload.city || null]
                );
            }
        }
        
        // Map route name to route ID if provided
        let routeId = payload.routeId;
        if (!routeId && payload.route) {
            const [routes] = await conn.query(
                'SELECT route_id FROM truck_routes WHERE end_location = ?',
                [payload.route]
            );
            if (routes.length > 0) {
                routeId = routes[0].route_id;
            } else {
                console.log(`Route '${payload.route}' not found in database`);
            }
        }
        
        // Create order
        const orderId = payload.orderId || uuidv4();
        const orderedDate = payload.orderedDate || new Date();
        const totalPrice = payload.totalAmount || 0;
        
        await conn.query(
            'INSERT INTO orders (order_id, customer_id, store_id, route_id, ordered_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orderId, customerId, payload.storeId || null, routeId, orderedDate, totalPrice, payload.status || 'Pending']
        );

        // Add order items
        if (Array.isArray(payload.items)) {
            for (const item of payload.items) {
                // Find product by name
                const [products] = await conn.query(
                    'SELECT product_id, unit_price FROM products WHERE product_name = ?',
                    [item.name]
                );
                
                if (products.length > 0) {
                    const product = products[0];
                    await conn.query(
                        'INSERT INTO order_items (order_id, product_id, quantity, item_capacity, unit_price) VALUES (?, ?, ?, ?, ?)',
                        [orderId, product.product_id, item.qty, null, product.unit_price]
                    );
                } else {
                    console.log(`Product '${item.name}' not found in database`);
                }
            }
        }

        await conn.commit();
        
        const result = { 
            orderId, 
            customerId,
            message: 'Order created successfully',
            totalAmount: totalPrice
        };
        
        console.log('Order created successfully:', result);
        return result;
        
    } catch (err) {
        await conn.rollback();
        console.error('Error creating order:', err);
        throw err;
    } finally {
        conn.release();
    }
}

// New function for order statistics
export async function getOrderStats() {
    const [stats] = await pool.query(`
        SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_orders,
            SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered_orders,
            AVG(total_price) as average_order_value
        FROM orders
    `);
    
    return stats[0];
}

// New function to get products for the frontend
export async function getProducts() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY product_name');
    return rows;
}