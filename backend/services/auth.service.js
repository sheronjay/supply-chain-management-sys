import pool from '../src/db/pool.js';

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
  
  // In a production system, passwords should be hashed
  // For now, we'll do a direct comparison since the DB might not have hashed passwords yet
  // TODO: Implement bcrypt password hashing
  if (customer.password && customer.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Return customer data without password
  const { password: _, ...customerData } = customer;
  return {
    user: {
      ...customerData,
      userType: 'customer'
    }
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

  // TODO: Hash password with bcrypt in production
  // const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new customer
  await pool.query(
    `INSERT INTO customers (customer_id, email, password, name, phone_number, city) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [newCustomerId, email, password, name, phone_number, city]
  );

  return {
    user: {
      customer_id: newCustomerId,
      email,
      name,
      phone_number,
      city,
      userType: 'customer'
    }
  };
}

/**
 * Employee Login (users table)
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
  
  // TODO: Implement bcrypt password comparison in production
  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Return user data without password
  const { password: _, ...userData } = user;
  return {
    user: {
      ...userData,
      userType: 'employee'
    }
  };
}

export {
  customerLogin,
  customerSignup,
  employeeLogin
};
