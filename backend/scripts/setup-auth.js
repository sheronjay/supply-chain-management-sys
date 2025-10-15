import bcrypt from 'bcrypt';
import pool from '../src/db/pool.js';

const SALT_ROUNDS = 10;

/**
 * Hash a password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Create test admin account
 */
async function createTestAdmin() {
  try {
    const username = 'admin';
    const email = 'admin@supplychain.com';
    const password = 'admin123'; // Change this in production!
    
    const hashedPassword = await hashPassword(password);
    
    // Check if admin already exists
    const [existing] = await pool.query(
      'SELECT * FROM admins WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existing.length > 0) {
      console.log('Admin account already exists. Updating password...');
      await pool.query(
        'UPDATE admins SET password = ? WHERE username = ?',
        [hashedPassword, username]
      );
      console.log('✅ Admin password updated');
    } else {
      const adminId = 'ADM-001';
      await pool.query(
        'INSERT INTO admins (admin_id, username, email, password) VALUES (?, ?, ?, ?)',
        [adminId, username, email, hashedPassword]
      );
      console.log('✅ Admin account created');
    }
    
    console.log('\nAdmin Credentials:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('\n⚠️  Change the admin password in production!');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

/**
 * Create test user accounts
 */
async function createTestUsers() {
  try {
    const users = [
      {
        user_id: 'USR-001',
        store_id: 'ST-CMB-01',
        name: 'john_doe',
        password: 'password123',
        designation: 'Store Manager',
        isManager: true,
      },
      {
        user_id: 'USR-002',
        store_id: 'ST-KDY-01',
        name: 'jane_smith',
        password: 'password123',
        designation: 'Delivery Driver',
        isDelivery: true,
      },
    ];

    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      
      // Check if user exists
      const [existing] = await pool.query(
        'SELECT * FROM users WHERE user_id = ?',
        [user.user_id]
      );
      
      if (existing.length > 0) {
        console.log(`User ${user.name} already exists. Updating password...`);
        await pool.query(
          'UPDATE users SET password = ? WHERE user_id = ?',
          [hashedPassword, user.user_id]
        );
      } else {
        await pool.query(
          'INSERT INTO users (user_id, store_id, name, password, designation, is_employed) VALUES (?, ?, ?, ?, ?, 1)',
          [user.user_id, user.store_id, user.name, hashedPassword, user.designation]
        );
        
        // Add to role-specific tables
        if (user.isManager) {
          await pool.query(
            'INSERT INTO store_managers (manager_id) VALUES (?) ON DUPLICATE KEY UPDATE manager_id = manager_id',
            [user.user_id]
          );
        }
        
        if (user.isDelivery) {
          await pool.query(
            'INSERT INTO delivery_employees (user_id, working_hours, availability) VALUES (?, "08:00-17:00", 1) ON DUPLICATE KEY UPDATE user_id = user_id',
            [user.user_id]
          );
        }
        
        console.log(`✅ User ${user.name} created`);
      }
      
      console.log(`Username: ${user.name}, Password: ${user.password}`);
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔐 Setting up authentication...\n');
  
  await createTestAdmin();
  console.log('\n');
  await createTestUsers();
  
  console.log('\n✨ Setup complete!');
  process.exit(0);
}

main();
