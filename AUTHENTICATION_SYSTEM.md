# Authentication System Implementation

## Overview

A complete authentication system has been implemented for the supply chain management system with separate portals for customers and employees.

## Test Credentials (From init.sql)

### Customer Login
```
Email: sunrise.wholesale@shop.lk (or any customer email)
Password: password123

All customers in the database have password: password123
```

### Employee Login
```
Driver:
User ID: USR-DRV-01
Password: emp123

Store Manager:
User ID: USR-MGR-CMB
Password: emp123

Main Store Manager:
User ID: USR-MGR-MAIN
Password: emp123

All employees have password: emp123
```

## Features

### Customer Portal (`/`)
- **Login**: Existing customers can sign in with email and password
- **Signup**: New customers can create an account with:
  - Email (required)
  - Password (required)
  - Full Name (required)
  - Phone Number (optional)
  - City (optional)
- After login/signup, customers are redirected to `/customer/orders` to view their orders

### Employee Portal (`/employee`)
- **Login Only**: Employees can only sign in with:
  - Employee ID (user_id)
  - Password
- No signup - only authorized employees can access
- After login, employees are redirected to `/dashboard`
- Access to all employee features based on their role

## Routes

### Public Routes
- `/` - Customer login/signup page
- `/employee` - Employee login page

### Customer Routes (Protected)
- `/customer/orders` - Customer's orders page

### Employee Routes (Protected)
- `/dashboard` - Main dashboard
- `/orders` - Orders management
- `/main-stores` - Main stores order processing
- `/store-manager` - Store manager functions
- `/drivers` - Driver deliveries
- `/train-schedule` - Train schedule management
- `/reports` - Report overview
- `/users` - User management
- `/settings` - Settings

## Backend API Endpoints

### Authentication Endpoints

#### Customer Login
```
POST /api/auth/customer/login
Body: {
  "email": "customer@example.com",
  "password": "password123"
}
```

#### Customer Signup
```
POST /api/auth/customer/signup
Body: {
  "email": "customer@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone_number": "0771234567",
  "city": "Colombo"
}
```

#### Employee Login
```
POST /api/auth/employee/login
Body: {
  "userId": "EMP-0001",
  "password": "password123"
}
```

## Database Changes

### Customers Table
Added `password` column to store customer passwords:
```sql
ALTER TABLE customers ADD COLUMN password VARCHAR(255);
```

### Users Table
The existing `password` column is used for employee authentication.

## Implementation Details

### Backend
- **Services**: `backend/services/auth.service.js`
  - `customerLogin()` - Authenticate customer
  - `customerSignup()` - Register new customer
  - `employeeLogin()` - Authenticate employee

- **Controllers**: `backend/src/controllers/auth.controller.js`
  - Handle HTTP requests and responses
  - Validate input data
  - Error handling

- **Routes**: `backend/src/routes/auth.routes.js`
  - Mount authentication endpoints

### Frontend
- **Services**: `frontend/src/services/authService.js`
  - API calls to backend
  - LocalStorage management

- **Context**: `frontend/src/context/AuthContext.jsx`
  - Global authentication state
  - Auth methods accessible via `useAuth()` hook

- **Components**:
  - `ProtectedRoute` - Route guard for authenticated users
  - `DashboardLayout` - Wrapper with sidebar and topbar
  - `CustomerLogin` - Customer login/signup page
  - `EmployeeLogin` - Employee login page

## Testing

### Sample Customer Login
1. Create a customer account at `/`
2. Fill in email, password, and name
3. Click "Sign Up"
4. You'll be redirected to `/customer/orders`

### Sample Employee Login
Use existing employee data from the database:
1. Go to `/employee`
2. Enter employee ID (e.g., from users table)
3. Enter password
4. You'll be redirected to `/dashboard`

## Security Notes

⚠️ **Important**: The current implementation uses plain text password comparison for development purposes.

### For Production:
1. **Password Hashing**: Uncomment bcrypt implementation in `auth.service.js`
2. **JWT Tokens**: Implement JSON Web Tokens for session management
3. **HTTPS**: Use HTTPS for all authentication requests
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **Password Policy**: Enforce strong password requirements
6. **Session Management**: Implement proper session timeouts

## Future Enhancements

1. **Role-Based Access Control (RBAC)**
   - Fine-grained permissions based on employee designation
   - Different access levels for managers, drivers, etc.

2. **Password Reset**
   - Email-based password reset flow
   - Security questions

3. **Two-Factor Authentication (2FA)**
   - SMS or email OTP
   - Authenticator app support

4. **Account Management**
   - Profile editing
   - Password change
   - Account deletion

5. **Audit Logging**
   - Track login attempts
   - Log user actions
   - Security monitoring

## Files Created

### Backend
- `backend/services/auth.service.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/routes/auth.routes.js`

### Frontend
- `frontend/src/services/authService.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/components/ProtectedRoute/ProtectedRoute.jsx`
- `frontend/src/components/DashboardLayout/DashboardLayout.jsx`
- `frontend/src/components/DashboardLayout/DashboardLayout.css`
- `frontend/src/pages/Auth/CustomerLogin.jsx`
- `frontend/src/pages/Auth/CustomerLogin.css`
- `frontend/src/pages/Auth/EmployeeLogin.jsx`
- `frontend/src/pages/Auth/EmployeeLogin.css`

### Modified Files
- `backend/src/app.js` - Added auth routes
- `docker/init.sql` - Added password column to customers table
- `frontend/src/App.jsx` - Added routing and authentication
- `frontend/src/App.css` - Cleaned up styles
