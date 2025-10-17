import pool from '../db/pool.js';

/**
 * Get all pending orders (status = 'PENDING')
 */
export async function getPendingOrders(req, res, next) {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.customer_id,
        o.store_id,
        s.city as store_city,
        o.sub_city_id,
        sc.sub_city_name,
        o.ordered_date,
        o.total_price,
        o.status,
        c.name as customer_name,
        c.email as customer_email,
        c.phone_number as customer_phone,
        COALESCE(SUM(oi.quantity * p.space_consumption_rate), 0) as total_capacity_required
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN stores s ON o.store_id = s.store_id
      LEFT JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.status = 'PENDING'
      GROUP BY o.order_id
      ORDER BY o.ordered_date ASC
    `;
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    next(error);
  }
}

/**
 * Get all train schedules with available capacity
 */
export async function getTrainSchedules(req, res, next) {
  try {
    const query = `
      SELECT 
        ts.trip_id,
        ts.day_date,
        ts.start_time,
        ts.arrival_time,
        ts.train_id,
        t.train_name,
        t.capacity as train_capacity,
        ts.end_store_id,
        s.city as destination_city,
        ts.available_capacity,
        (t.capacity - ts.available_capacity) as used_capacity
      FROM train_schedules ts
      LEFT JOIN trains t ON ts.train_id = t.train_id
      LEFT JOIN stores s ON ts.end_store_id = s.store_id
      WHERE ts.day_date >= CURDATE()
      ORDER BY ts.day_date ASC, ts.start_time ASC
    `;
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching train schedules:', error);
    next(error);
  }
}

/**
 * Process an order by assigning it to a train schedule
 */
export async function processOrder(req, res, next) {
  const connection = await pool.getConnection();
  
  try {
    const { orderId, tripId } = req.body;
    
    if (!orderId || !tripId) {
      return res.status(400).json({ 
        message: 'Order ID and Trip ID are required' 
      });
    }

    await connection.beginTransaction();

    // Get order capacity requirement
    const [orderRows] = await connection.query(`
      SELECT 
        o.order_id,
        o.store_id,
        COALESCE(SUM(oi.quantity * p.space_consumption_rate), 0) as capacity_required
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.order_id = ?
      GROUP BY o.order_id
    `, [orderId]);

    if (orderRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRows[0];
    const capacityRequired = parseFloat(order.capacity_required);

    // Get train schedule details
    const [scheduleRows] = await connection.query(`
      SELECT 
        ts.trip_id,
        ts.available_capacity,
        ts.end_store_id,
        t.capacity as train_capacity
      FROM train_schedules ts
      LEFT JOIN trains t ON ts.train_id = t.train_id
      WHERE ts.trip_id = ?
    `, [tripId]);

    if (scheduleRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Train schedule not found' });
    }

    const schedule = scheduleRows[0];
    const availableCapacity = parseFloat(schedule.available_capacity);

    // Check if order destination matches train schedule destination
    if (order.store_id !== schedule.end_store_id) {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Order destination does not match train schedule destination' 
      });
    }

    // Check if there's enough capacity
    if (capacityRequired > availableCapacity) {
      await connection.rollback();
      return res.status(400).json({ 
        message: `Insufficient capacity. Required: ${capacityRequired}, Available: ${availableCapacity}` 
      });
    }

    // Insert into train_schedule_orders junction table
    await connection.query(`
      INSERT INTO train_schedule_orders (trip_id, order_id)
      VALUES (?, ?)
    `, [tripId, orderId]);

    // Update available capacity
    const newAvailableCapacity = availableCapacity - capacityRequired;
    await connection.query(`
      UPDATE train_schedules
      SET available_capacity = ?
      WHERE trip_id = ?
    `, [newAvailableCapacity, tripId]);

    // Update order status to TRAIN
    await connection.query(`
      UPDATE orders
      SET status = 'TRAIN'
      WHERE order_id = ?
    `, [orderId]);

    await connection.commit();

    res.json({ 
      message: 'Order processed successfully',
      orderId,
      tripId,
      capacityUsed: capacityRequired,
      remainingCapacity: newAvailableCapacity
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error processing order:', error);
    next(error);
  } finally {
    connection.release();
  }
}

/**
 * Get orders assigned to a specific train schedule
 */
export async function getScheduleOrders(req, res, next) {
  try {
    const { tripId } = req.params;
    
    const query = `
      SELECT 
        o.order_id,
        o.customer_id,
        c.name as customer_name,
        o.ordered_date,
        o.total_price,
        o.status,
        tso.assigned_date,
        COALESCE(SUM(oi.quantity * p.space_consumption_rate), 0) as capacity_used
      FROM train_schedule_orders tso
      JOIN orders o ON tso.order_id = o.order_id
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE tso.trip_id = ?
      GROUP BY o.order_id
      ORDER BY tso.assigned_date DESC
    `;
    
    const [rows] = await pool.query(query, [tripId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching schedule orders:', error);
    next(error);
  }
}
