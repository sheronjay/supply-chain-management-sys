import pool from '../src/db/pool.js';
import bcrypt from 'bcryptjs';

export const listUsers = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT user_id, store_id, name, designation, is_employed FROM users WHERE designation <> 'Admin'`
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const createUser = async (userData) => {
  const connection = await pool.getConnection();
  try {
    const {
      user_id,
      store_id = null,
      name,
      password,
      designation,
      is_employed = 1,
    } = userData;

    // Hash password before storing
    const passwordHash = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO users (user_id, store_id, name, password, designation, is_employed)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, store_id, name, passwordHash, designation, is_employed ? 1 : 0]
    );

    return { user_id };
  } finally {
    connection.release();
  }
};

export const updateUser = async (userId, updates) => {
  const connection = await pool.getConnection();
  try {
    // Build dynamic update set (exclude undefined)
    const fields = [];
    const values = [];
    const allowed = ['store_id', 'name', 'password', 'designation', 'is_employed'];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        fields.push(`${key} = ?`);
        values.push(key === 'is_employed' ? (updates[key] ? 1 : 0) : updates[key]);
      }
    }
    if (fields.length === 0) return { affectedRows: 0 };

    values.push(userId);
    const [result] = await connection.query(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
      values
    );
    return { affectedRows: result.affectedRows };
  } finally {
    connection.release();
  }
};

export const deleteUser = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `DELETE FROM users WHERE user_id = ?`,
      [userId]
    );
    return { affectedRows: result.affectedRows };
  } finally {
    connection.release();
  }
};

export const toggleEmployment = async (userId, isEmployed) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE users SET is_employed = ? WHERE user_id = ?`,
      [isEmployed ? 1 : 0, userId]
    );
    return { affectedRows: result.affectedRows };
  } finally {
    connection.release();
  }
};

