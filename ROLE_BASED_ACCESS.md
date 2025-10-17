# Role-Based Access Control - Update

## Changes Made

The system has been updated to provide role-specific views based on user designation.

## User Access Levels

### 1. **Customers**
- **Access**: Only "My Orders" page
- **Features**:
  - No sidebar navigation
  - Logout button in top-right corner
  - Shows "Customer" role in TopBar
  - Full-width content area

### 2. **Main Store Manager** 
- **Access**: Restricted sidebar with Main Stores, Train Schedule, and User Management
- **Redirect**: After login → `/main-stores` page
- **Features**:
  - Sidebar navigation with 3 pages: Main Stores, Train Schedule, and User Management
  - Cannot access other pages (Dashboard, Orders, My Orders, Store Manager, Drivers, Reports)
  - Shows "Main Store Manager" role in TopBar
  - Can process pending orders and assign to train schedules
  - Can manage users and roles
  - Logout via sidebar "Sign Out"

### 3. **Store Manager**
- **Access**: Restricted sidebar with Dashboard, Orders, Store Manager, and Report Overview
- **Redirect**: After login → `/store-manager` page
- **Features**:
  - Sidebar navigation with 4 pages: Dashboard, Orders, Store Manager, Report Overview
  - Cannot access: My Orders, Main Stores, Drivers, Train Schedule, User Management
  - Access to store management functions, truck assignments, and reports
  - Logout via sidebar "Sign Out"

### 4. **Drivers & Assistants**
- **Access**: Restricted sidebar with Drivers page only
- **Redirect**: After login → `/drivers` page
- **Features**:
  - Sidebar navigation with 1 page: Drivers
  - Cannot access other pages (Dashboard, Orders, Store Manager, Main Stores, Reports, etc.)
  - Access to delivery functions, working hours, and assigned orders
  - Logout via sidebar "Sign Out"

### 5. **Admin**
- **Access**: Full system with sidebar
- **Redirect**: After login → `/dashboard` page
- **Features**:
  - Full sidebar navigation (all pages)
  - Access to all system features
  - Logout via sidebar "Sign Out"

## Test Credentials

### Customer Login (/)
```
Email: sunrise.wholesale@shop.lk
Password: password123
Redirect: /customer/orders
```

### Main Store Manager (/employee)
```
User ID: USR-MGR-MAIN
Password: emp123
Redirect: /main-stores
View: Main Stores page only (no sidebar)
```

### Store Manager (/employee)
```
User ID: USR-MGR-CMB
Password: emp123
Redirect: /store-manager
View: Full system with sidebar
```

### Driver (/employee)
```
User ID: USR-DRV-01
Password: emp123
Redirect: /drivers
View: Full system with sidebar
```

## Files Modified

1. **`DashboardLayout.jsx`**
   - Added check for Main Store Manager designation
   - Conditionally hide sidebar for customers and Main Store Manager
   - Pass userDesignation to TopBar

2. **`TopBar.jsx`**
   - Accept userDesignation prop
   - Display actual designation instead of generic "Employee"
   - Show logout button for customers and Main Store Manager

3. **`EmployeeLogin.jsx`**
   - Implement role-based redirect after login
   - Main Store Manager → `/main-stores`
   - Store Manager → `/store-manager`
   - Driver/Assistant → `/drivers`
   - Others → `/dashboard`

## Files Created

1. **`EmployeeRedirect.jsx`** (optional component for future use)
   - Centralized employee redirect logic
   - Can be used in routes for automatic redirection

## Benefits

✅ **Focused User Experience**: Each role sees only what they need
✅ **Better Workflow**: Main Store Manager has dedicated, distraction-free interface
✅ **Clear Role Identification**: TopBar shows actual designation
✅ **Consistent UX**: Similar experience for customers and Main Store Manager
✅ **Flexible Access**: Other employees retain full system access

## Future Enhancements

1. **Fine-grained Permissions**: Restrict specific actions based on roles
2. **Role Hierarchies**: Admin override capabilities
3. **Multi-role Support**: Users with multiple designations
4. **Activity Logging**: Track role-based actions
5. **Dynamic Role Assignment**: Change roles without logout
