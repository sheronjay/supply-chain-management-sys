import pool from '../db/pool.js'

/**
 * Get delivery schedules for a specific user (driver/assistant)
 */
export const getMyDeliveries = async (req, res) => {
  try {
    const userId = req.user.user_id
    
    // Query to get deliveries assigned to the user
    const query = `
      SELECT 
        ds.delivery_id,
        ds.order_id,
        ds.delivered_date,
        ds.vehicle_arrival_time,
        ds.vehicle_departure_time,
        ds.delivery_status,
        o.status as order_status,
        o.total_price,
        o.ordered_date,
        c.name as customer_name,
        c.email as customer_email,
        c.phone_number as customer_phone,
        c.city as customer_city,
        tr.route_id,
        tr.end_location,
        tr.distance_km,
        v.vehicle_type,
        v.register_number,
        s.store_id,
        s.city as store_city
      FROM delivery_schedules ds
      INNER JOIN orders o ON ds.order_id = o.order_id
      INNER JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN truck_routes tr ON o.route_id = tr.route_id
      INNER JOIN vehicles v ON ds.vehicle_id = v.vehicle_id
      LEFT JOIN stores s ON o.store_id = s.store_id
      WHERE ds.driver_id = ?
      ORDER BY ds.delivered_date DESC, ds.vehicle_arrival_time DESC
    `
    
    const [deliveries] = await pool.query(query, [userId])
    
    res.json({
      success: true,
      deliveries
    })
  } catch (error) {
    console.error('Error fetching deliveries:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching deliveries'
    })
  }
}

/**
 * Get upcoming deliveries for a specific user
 */
export const getUpcomingDeliveries = async (req, res) => {
  try {
    const userId = req.user.user_id
    
    const query = `
      SELECT 
        ds.delivery_id,
        ds.order_id,
        ds.delivered_date,
        ds.vehicle_arrival_time,
        ds.vehicle_departure_time,
        ds.delivery_status,
        o.status as order_status,
        o.total_price,
        c.name as customer_name,
        c.city as customer_city,
        tr.end_location,
        tr.distance_km,
        v.register_number
      FROM delivery_schedules ds
      INNER JOIN orders o ON ds.order_id = o.order_id
      INNER JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN truck_routes tr ON o.route_id = tr.route_id
      INNER JOIN vehicles v ON ds.vehicle_id = v.vehicle_id
      WHERE ds.driver_id = ?
      AND ds.delivery_status = 0
      AND (ds.delivered_date >= CURDATE() OR ds.delivered_date IS NULL)
      ORDER BY ds.delivered_date ASC, ds.vehicle_arrival_time ASC
      LIMIT 20
    `
    
    const [deliveries] = await pool.query(query, [userId])
    
    res.json({
      success: true,
      deliveries
    })
  } catch (error) {
    console.error('Error fetching upcoming deliveries:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching upcoming deliveries'
    })
  }
}

/**
 * Update delivery status
 */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { delivery_id } = req.params
    const { delivery_status } = req.body
    
    // Validate delivery_status
    if (delivery_status === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Delivery status is required'
      })
    }
    
    // Update the delivery status
    await pool.query(
      'UPDATE delivery_schedules SET delivery_status = ? WHERE delivery_id = ?',
      [delivery_status, delivery_id]
    )
    
    // If marked as delivered, also update the order status
    if (delivery_status === 1) {
      await pool.query(
        'UPDATE orders o SET o.status = "DELIVERED" WHERE o.order_id = (SELECT order_id FROM delivery_schedules WHERE delivery_id = ?)',
        [delivery_id]
      )
    }
    
    res.json({
      success: true,
      message: 'Delivery status updated successfully'
    })
  } catch (error) {
    console.error('Error updating delivery status:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating delivery status'
    })
  }
}
