# Separate Customer and Organization Portals

## Overview
The application now has two separate portals accessible via different URLs:
- **Organization Portal**: `http://localhost:5173/org` (for employees, managers, admins)
- **Customer Portal**: `http://localhost:5173/customer` (for customers only)

## URL Structure

### Routes
- `/org` - Organization Portal (Employee/Admin Dashboard)
- `/customer` - Customer Portal (My Orders)
- `/` - Redirects to `/org` by default

## Features

### Organization Portal (`/org`)
- **Access**: Employees, Store Managers, Delivery Personnel, Admins
- **Features**:
  - Full dashboard with sidebar navigation
  - Orders management
  - Train schedules
  - Reports
  - User management
  - All organizational features

### Customer Portal (`/customer`)
- **Access**: Customers only
- **Features**:
  - Clean, simplified interface without sidebar
  - "My Orders" page (view and place orders)
  - Sign-out button in top bar
  - Customer-focused experience

## Authentication & Role-Based Access

### Automatic Redirection
- **Customers** logging in at `/org` → automatically redirected to `/customer`
- **Employees/Admins** logging in at `/customer` → automatically redirected to `/org`

### Customer Signup
- Customers can sign up at the Customer Portal (`/customer`)
- After signup, they automatically get access to "My Orders"

## Test Credentials

### Organization Portal Users
```
Admin:
  username: admin
  password: admin123

Store Manager:
  username: john_doe
  password: password123

Delivery Employee:
  username: jane_smith
  password: password123
```

### Customer Portal Users
```
Customer 1:
  email: sunrise.wholesale@shop.lk
  password: password123

Customer 2:
  email: pettah.mart@shop.lk
  password: password123
```

## File Structure

### New Files
```
frontend/src/portals/
  ├── OrganizationPortal.jsx  # Organization dashboard
  └── CustomerPortal.jsx       # Customer portal
```

### Modified Files
```
frontend/src/
  ├── App.jsx                  # Now uses React Router for routing
  └── package.json             # Added react-router-dom dependency
```

## Technical Implementation

### React Router
- Uses `react-router-dom` for client-side routing
- Each portal is a separate component
- Automatic role-based redirects

### Security
- Role verification on login
- Automatic redirect if wrong portal accessed
- Token-based authentication maintained

## Usage

### Accessing the Portals

1. **For Organization/Employees**:
   - Go to `http://localhost:5173/org`
   - Login with employee/admin credentials
   - Access full dashboard

2. **For Customers**:
   - Go to `http://localhost:5173/customer`
   - Sign up as new customer or login
   - Access My Orders page

### Development
- Start the application: `npm run dev`
- Both portals run on the same server
- Routing handled client-side by React Router

## Benefits

1. **Clear Separation**: Customers and employees have completely separate experiences
2. **Simplified UX**: Customers see only what they need
3. **Security**: Role-based access prevents unauthorized access
4. **Scalability**: Easy to add more features to each portal independently
5. **Professional**: Separate URLs make it clear which portal users are accessing
