import pool from '../src/db/pool.js';

export const getTrainSchedules = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        ts.trip_id,
        ts.day_date,
        ts.start_time,
        ts.arrival_time,
        ts.available_capacity,
        t.train_id,
        t.train_name,
        t.capacity as train_capacity,
        s.city as destination_city
      FROM train_schedules ts
      LEFT JOIN trains t ON ts.train_id = t.train_id
      LEFT JOIN stores s ON ts.end_store_id = s.store_id
      WHERE ts.day_date >= CURDATE()
      ORDER BY ts.day_date ASC, ts.start_time ASC
    `);
    return rows;
  } finally {
    connection.release();
  }
};

export const createTrainSchedule = async (scheduleData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Get train capacity
    const [trainRows] = await connection.query(
      'SELECT capacity FROM trains WHERE train_id = ?',
      [scheduleData.train_id]
    );
    
    if (trainRows.length === 0) {
      throw new Error('Train not found');
    }
    
    // Generate trip ID
    const tripId = `TRIP-${Date.now().toString().slice(-8)}`;
    
    // Insert new schedule with full available capacity
    await connection.query(`
      INSERT INTO train_schedules (
        trip_id, day_date, start_time, arrival_time,
        train_id, end_store_id, available_capacity
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      tripId,
      scheduleData.day_date,
      scheduleData.start_time,
      scheduleData.arrival_time,
      scheduleData.train_id,
      scheduleData.end_store_id,
      trainRows[0].capacity // Set initial available capacity to train's total capacity
    ]);
    
    await connection.commit();
    return { tripId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getTrains = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT train_id, train_name, capacity FROM trains');
    return rows;
  } finally {
    connection.release();
  }
};

export const getStores = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT store_id, city FROM stores');
    return rows;
  } finally {
    connection.release();
  }
};