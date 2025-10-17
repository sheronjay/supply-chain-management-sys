# Store Manager Access Update

## Overview

Store Managers now have a restricted sidebar view with access only to pages relevant to their store operations, removing access to company-wide features like Main Stores, Train Schedules, Drivers, and User Management.

## Changes Made

### Files Modified

**frontend/src/components/Sidebar/Sidebar.jsx**
- Added `storeManagerNavItems` array with 4 navigation items
- Updated conditional logic to check for 'Store Manager' designation
- Store Managers see: Dashboard, Orders, Store Manager, Report Overview

**ROLE_BASED_ACCESS.md**
- Updated Store Manager section with detailed access restrictions
- Clarified which pages Store Managers can and cannot access

## Implementation

```javascript
// Navigation items for Store Manager (restricted access)
const storeManagerNavItems = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'Orders', label: 'Orders', icon: 'orders' },
  { key: 'StoreManager', label: 'Store Manager', icon: 'storemanager' },
  { key: 'ReportOverview', label: 'Report Overview', icon: 'report' },
]

const Sidebar = ({ activePage, onNavigate, userDesignation }) => {
  let navItems = allNavItems;
  
  if (userDesignation === 'Main Store Manager') {
    navItems = mainStoreManagerNavItems;
  } else if (userDesignation === 'Store Manager') {
    navItems = storeManagerNavItems;
  } else if (userDesignation === 'Driver' || userDesignation === 'Assistant') {
    navItems = driverNavItems;
  }
  // ... rest of component
};
```

## Access Summary

### Store Manager Can Access:
- ✅ **Dashboard** - View store analytics and metrics
- ✅ **Orders** - View and manage orders for their store
- ✅ **Store Manager** - Assign trucks, manage delivery employees, view inventory
- ✅ **Report Overview** - Access reports relevant to their store

### Store Manager Cannot Access:
- ❌ **My Orders** - Customer-specific feature
- ❌ **Main Stores** - Central warehouse management (Main Store Manager only)
- ❌ **Drivers** - Driver-specific delivery interface
- ❌ **Train Schedule** - Central logistics (Main Store Manager only)
- ❌ **User Management** - System administration (Admin/Main Store Manager only)

### Available in Sidebar:
- Dashboard (4 navigation items)
- Orders
- Store Manager
- Report Overview
- Settings (bottom section)
- Sign Out (bottom section)

## Login Flow

1. **Login**: Employee portal at `/employee`
   - User ID: `USR-MGR-CMB`
   - Password: `emp123`

2. **Redirect**: Automatically redirected to `/store-manager` page

3. **Navigation**: 
   - Restricted sidebar with 4 items
   - Cannot navigate to restricted pages
   - Settings and Sign Out available at bottom

## Store Manager Page Features

On their main page, Store Managers can:
- View store inventory
- Manage delivery employees (drivers and assistants)
- View and manage store-specific orders
- Assign trucks to orders
- Update order status
- Track delivery progress

## UI Layout

```
┌──────────┬───────────────────────────┐
│          │         TopBar            │
│ Sidebar  ├───────────────────────────┤
│ (4 items)│                           │
│ • Dash   │                           │
│ • Orders │   Store Manager Page      │
│ • Store  │   - Inventory             │
│ • Reports│   - Delivery Employees    │
│          │   - Store Orders          │
│          │   - Truck Assignment      │
│          │                           │
│ Settings │                           │
│ Sign Out │                           │
└──────────┴───────────────────────────┘
```

## Main Store Manager Update

**Added User Management** to Main Store Manager's sidebar.

### Main Store Manager Can Now Access:
- ✅ **Main Stores** - Process pending orders
- ✅ **Train Schedule** - Assign orders to trains
- ✅ **User Management** - Manage users and roles (NEW)

## Comparison of All Roles

| Role | Sidebar Items | Dashboard | Orders | My Orders | Main Stores | Store Mgr | Drivers | Train | Reports | Users |
|------|--------------|-----------|--------|-----------|-------------|-----------|---------|-------|---------|-------|
| Customer | 0 | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Driver | 1 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Store Manager | 4 | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Main Store Mgr | 3 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Admin | All | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Test Credentials

### Store Manager Login
```
User ID: USR-MGR-CMB
Password: emp123
Name: Rashmi De Silva
Store: ST-CMB-01 (Colombo)
Designation: Store Manager
```

### Main Store Manager Login
```
User ID: USR-MGR-MAIN
Password: emp123
Name: Anura Perera
Designation: Main Store Manager
```

## Rationale

### Why Restrict Store Manager Access?

1. **Scope of Responsibility**:
   - Store Managers oversee individual store operations
   - No need for central warehouse (Main Stores) access
   - No need to manage train schedules
   - Should focus on their store's performance

2. **Security & Data Isolation**:
   - Store Managers shouldn't see other stores' detailed operations
   - Driver interface is for field workers, not managers
   - User management is administrative function

3. **Operational Focus**:
   - Dashboard for store analytics
   - Orders for customer fulfillment
   - Store Manager page for day-to-day operations
   - Reports for performance tracking

4. **Clear Hierarchy**:
   - Main Store Manager handles central logistics
   - Store Managers handle local store operations
   - Drivers handle deliveries
   - Each role has distinct responsibilities

### Why Add User Management to Main Store Manager?

1. **Administrative Authority**:
   - Main Store Managers need to manage staff across stores
   - Can add/edit delivery employees, store managers
   - Central oversight of human resources

2. **Operational Necessity**:
   - Need to assign drivers and assistants
   - Manage user roles and permissions
   - Coordinate staffing across the supply chain

## Future Enhancements

Potential improvements:

1. **Multi-Store Access**: Allow Store Managers to manage multiple stores if needed
2. **Cross-Store Reporting**: Aggregate reports for regional managers
3. **Temporary Permissions**: Grant elevated access for specific tasks/periods
4. **Delegation**: Allow Store Managers to delegate tasks within their team
5. **Performance Metrics**: Store-specific KPIs and targets on Dashboard
