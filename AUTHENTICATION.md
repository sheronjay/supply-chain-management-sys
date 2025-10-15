# Authentication System Documentation

## Overview
This supply chain management system now includes a secure authentication system. Users must log in to access the application. There is **no signup functionality** - all user accounts are created manually by administrators.

## Features
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access (Admin, Store Manager, Delivery Employee)
- ✅ Token-based session management
- ✅ Automatic logout functionality
- ✅ Protected routes

## Test Accounts

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator
- **Permissions:** Full system access

### User Accounts

#### Store Manager
- **Username:** `john_doe`
- **Password:** `password123`
- **Role:** Store Manager
- **Store:** Colombo (ST-CMB-01)

#### Delivery Employee
- **Username:** `jane_smith`
- **Password:** `password123`
- **Role:** Delivery Employee
- **Store:** Kandy (ST-KDY-01)

## Architecture

### Frontend Components
```
frontend/src/
├── pages/
│   └── Login/
│       ├── Login.jsx          # Login page component
│       └── Login.css          # Login page styles
├── services/
│   └── authService.js         # Authentication service (login, logout, token management)
└── App.jsx                    # Updated with authentication logic
```

### Backend Components
```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js      # Authentication controller
│   ├── routes/
│   │   └── auth.routes.js          # Authentication routes
│   └── app.js                      # Updated with auth routes
├── middleware/
│   └── auth.js                     # JWT verification middleware
└── scripts/
    └── setup-auth.js               # Password hashing and user setup script
```

## API Endpoints

### Public Endpoints
- `POST /api/auth/login` - User login

### Protected Endpoints
- `GET /api/auth/verify` - Verify JWT token

## Usage

### Starting the Application
1. Make sure the database is running:
   ```bash
   docker-compose up -d
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. Navigate to the application - you'll be presented with the login page

### Logging In
1. Enter your username and password
2. Click "Sign In"
3. Upon successful login, you'll be redirected to the Dashboard
4. Your session persists across page refreshes

### Logging Out
1. Click on "Sign Out" in the sidebar
2. You'll be logged out and redirected to the login page
3. Your session token is removed

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Plain text passwords are never stored in the database
- Password comparison is done securely using bcrypt

### Token Security
- JWT tokens are used for session management
- Tokens expire after 24 hours (configurable)
- Tokens are stored in localStorage
- Protected routes verify token validity

### Environment Variables
Add to your `.env` file in the backend directory:
```
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

⚠️ **Important:** Change the JWT_SECRET in production!

## Creating New Users

### Method 1: Using the Setup Script
Modify `backend/scripts/setup-auth.js` and run:
```bash
cd backend
node scripts/setup-auth.js
```

### Method 2: Manual SQL (Recommended for Production)
1. Hash your password first:
```javascript
const bcrypt = require('bcrypt');
const password = 'your-password';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

2. Insert into database:
```sql
-- For admin users
INSERT INTO admins (admin_id, username, email, password) 
VALUES ('ADM-002', 'username', 'email@example.com', 'hashed_password');

-- For regular users
INSERT INTO users (user_id, store_id, name, password, designation, is_employed) 
VALUES ('USR-003', 'ST-CMB-01', 'username', 'hashed_password', 'Manager', 1);

-- If user is a store manager
INSERT INTO store_managers (manager_id) VALUES ('USR-003');

-- If user is a delivery employee
INSERT INTO delivery_employees (user_id, working_hours, availability) 
VALUES ('USR-003', '08:00-17:00', 1);
```

## User Roles

### Admin
- Full system access
- Can manage all resources
- Access to User Management

### Store Manager
- Manage store inventory
- View and process orders
- Access to store-specific data

### Delivery Employee
- View assigned deliveries
- Update delivery status
- Access to route information

## Troubleshooting

### "Invalid username or password"
- Check that the username is correct (case-sensitive)
- Verify the password
- Ensure the user exists in the database
- For regular users, check `is_employed = 1`

### Token expired
- Login again to get a new token
- Tokens expire after 24 hours by default

### Cannot access certain pages
- Check your user role and permissions
- Some pages may require specific roles

## Future Enhancements
- [ ] Password reset functionality
- [ ] Remember me option
- [ ] Two-factor authentication
- [ ] Session timeout warnings
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Audit logging for authentication events

## Database Schema

### admins table
```sql
admin_id     VARCHAR(255) PRIMARY KEY
username     VARCHAR(255) UNIQUE
email        VARCHAR(255) UNIQUE
password     VARCHAR(255)  -- bcrypt hashed
```

### users table
```sql
user_id      VARCHAR(255) PRIMARY KEY
store_id     VARCHAR(255)
name         VARCHAR(255)  -- Used as username
password     VARCHAR(255)  -- bcrypt hashed
designation  VARCHAR(255)
is_employed  TINYINT(1)    -- Must be 1 to login
```

## Support
For issues or questions about the authentication system, contact your system administrator.
