import pool from '../src/db/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';   //  Added for JWT
import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper: Generate JWT
 */
function generateToken(payload) {  // Added for JWT
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}




/**
 * Customer Login
 */
async function customerLogin(email, password) {
  const [customers] = await pool.query(
    'SELECT * FROM customers WHERE email = ?',
    [email]
  );

  if (customers.length === 0) {
    throw new Error('Invalid credentials');
  }

  const customer = customers[0];

  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = generateToken({
    id: customer.customer_id,
    email: customer.email,
    userType: 'customer'
  });

  // Return customer data without password
  const { password: _, ...customerData } = customer;
  return {
    user: {
      ...customerData,
      userType: 'customer'
    },
    token  //  Include token in response
  };
}

/**
 * Customer Signup
 */
async function customerSignup(customerData) {
  const { email, password, name, phone_number, city } = customerData;

  // Check if customer already exists
  const [existing] = await pool.query(
    'SELECT customer_id FROM customers WHERE email = ?',
    [email]
  );
  if (existing.length > 0) {
    throw new Error('Customer with this email already exists');
  }

  // Generate customer ID
  const [lastCustomer] = await pool.query(
    'SELECT customer_id FROM customers ORDER BY customer_id DESC LIMIT 1'
  );
  let newCustomerId = 'CUST-0001';
  if (lastCustomer.length > 0) {
    const lastId = parseInt(lastCustomer[0].customer_id.split('-')[1]);
    newCustomerId = `CUST-${String(lastId + 1).padStart(4, '0')}`;
  }

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 12);

  // Insert new customer
  await pool.query(
    `INSERT INTO customers (customer_id, email, password, name, phone_number, city) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [newCustomerId, email, hashedPassword, name, phone_number, city]
  );

// Generate JWT
  const token = generateToken({
    id: newCustomerId,
    email,
    userType: 'customer'
  });


  return {
    user: {
      customer_id: newCustomerId,
      email,
      name,
      phone_number,
      city,
      userType: 'customer'
    },
    token  // Include token in response
  };
}

/**
 * Employee Login
 */
async function employeeLogin(userId, password) {
  const [users] = await pool.query(
    'SELECT * FROM users WHERE user_id = ? AND is_employed = 1',
    [userId]
  );

  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = users[0];

  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

    //  Generate JWT
  const token = generateToken({
    id: user.user_id,
    designation: user.designation,
    store_id: user.store_id,
    userType: 'employee'
  });


  // Return user data without password
  const { password: _, ...userData } = user;
  return {
    user: {
      ...userData,
      userType: 'employee'
    },
     token  // Include token in response
  };
}

export {
  customerLogin,
  customerSignup,
  employeeLogin
};
