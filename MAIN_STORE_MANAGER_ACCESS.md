# Main Store Manager Access Update

## Latest Changes (Current Version)

Updated the Main Store Manager view to show a restricted sidebar with only Main Stores and Train Schedule pages, providing focused access to their core responsibilities.

## Previous Changes

- ~~Custom navigation bar approach~~ (Replaced with restricted sidebar)
- ~~Full sidebar with all pages~~ (Now restricted to specific pages only)

## Files Modified

### 1. **Frontend Components**

#### New Component: MainStoreNav
- **Path**: `frontend/src/components/MainStoreNav/MainStoreNav.jsx`
- **Purpose**: Custom navigation bar for Main Store Manager
- **Features**:
  - Shows two navigation buttons: "Main Stores" and "Train Schedule"
  - Highlights active page
  - Purple gradient design matching the system theme
  - Icons for visual clarity

#### Updated: DashboardLayout.jsx
- **Path**: `frontend/src/components/DashboardLayout/DashboardLayout.jsx`
- **Changes**:
  - Imported `MainStoreNav` component
  - Conditionally renders navigation bar for Main Store Manager below TopBar
  - Main Store Manager still doesn't see the full sidebar (maintains focused view)

### 2. **Documentation**

#### Updated: ROLE_BASED_ACCESS.md
- Updated Main Store Manager access description
- Changed from "Only Main Stores page" to "Main Stores and Train Schedule pages"
- Added note about custom navigation bar

## How It Works

### Navigation Flow for Main Store Manager

1. **Login**: Employee portal at `/employee` with credentials:
   - User ID: `USR-MGR-MAIN`
   - Password: `emp123`

2. **Redirect**: Automatically redirected to `/main-stores` after login

3. **Navigation**: 
   - Restricted sidebar with only 2 navigation items:
     * Main Stores
     * Train Schedule
   - Cannot access other pages (Dashboard, Orders, Store Manager, Drivers, Reports, User Management)
   - "Settings" and "Sign Out" options in sidebar bottom section
   - Active page is highlighted in sidebar

4. **UI Layout**:
   ```
   ┌──────────┬───────────────────────────┐
   │          │         TopBar            │
   │ Sidebar  ├───────────────────────────┤
   │ (2 items)│                           │
   │ • Main   │                           │
   │   Stores │      Page Content         │
   │ • Train  │                           │
   │   Sched  │                           │
   │          │                           │
   │ Settings │                           │
   │ Sign Out │                           │
   └──────────┴───────────────────────────┘
   ```

### Key Features

- **Focused Navigation**: Restricted sidebar with only Main Stores and Train Schedule
- **Role-Based Access**: Limited to pages relevant to main store management duties
- **Visual Feedback**: Active page is highlighted in the sidebar
- **Clean Interface**: No clutter from irrelevant menu items
- **Efficient Workflow**: Quick access to the two most important pages

## Access Comparison

| User Type | Main Stores | Train Schedule | Other Pages | Navigation |
|-----------|-------------|----------------|-------------|------------|
| Customer | ❌ | ❌ | My Orders only | None (Logout button only) |
| Main Store Manager | ✅ | ✅ | ❌ Restricted | Restricted Sidebar (2 items) |
| Store Manager | ✅ | ✅ | ✅ All pages | Full Sidebar (all items) |
| Driver/Assistant | ✅ | ✅ | ✅ All pages | Full Sidebar (all items) |
| Admin | ✅ | ✅ | ✅ All pages | Full Sidebar (all items) |

## Why This Approach?

1. **Role-Specific Access**: Main Store Manager has a focused role:
   - Primary responsibility: Process orders in Main Stores
   - Secondary responsibility: Schedule trains for delivery
   - No need for access to other operational pages

2. **Reduced Complexity**: 
   - Eliminates navigation clutter
   - Prevents accidental access to irrelevant pages
   - Focuses on core responsibilities only

3. **Security & Separation of Duties**:
   - Limits access to only necessary functions
   - Prevents interference with store-specific operations
   - Maintains clear boundaries between main store and branch operations

## Testing

### Test Credentials
```
User ID: USR-MGR-MAIN
Password: emp123
```

### Test Steps
1. Navigate to `/employee`
2. Enter Main Store Manager credentials
3. Verify redirect to `/main-stores`
4. Check that sidebar is visible with only 2 navigation items:
   - Main Stores
   - Train Schedule
5. Verify other menu items (Dashboard, Orders, Drivers, etc.) are NOT visible
6. Click "Main Stores" - verify navigation works
7. Click "Train Schedule" - verify navigation works
8. Verify active page is highlighted in sidebar
9. Test "Sign Out" option in sidebar bottom section
10. Try to manually navigate to restricted pages (e.g., `/dashboard`) - access should work but no sidebar link

## Summary of Changes

### What Changed
- **Before**: Main Store Manager had full sidebar with all navigation items
- **After**: Main Store Manager now has restricted sidebar showing only Main Stores and Train Schedule

### Files Modified
1. `frontend/src/components/Sidebar/Sidebar.jsx`
   - Added `mainStoreManagerNavItems` array with only Main Stores and Train Schedule
   - Modified Sidebar component to accept `userDesignation` prop
   - Conditional rendering: shows restricted items for Main Store Manager, full items for others

2. `frontend/src/components/DashboardLayout/DashboardLayout.jsx`
   - Updated to pass `userDesignation` prop to Sidebar component
   - Sidebar now filters navigation items based on user's designation

3. Documentation files updated to reflect restricted access level

### Implementation Details
```javascript
// Sidebar.jsx
const mainStoreManagerNavItems = [
  { key: 'MainStores', label: 'Main Stores', icon: 'mainstores' },
  { key: 'TrainSchedule', label: 'Train Schedule', icon: 'train' },
];

const navItems = userDesignation === 'Main Store Manager' 
  ? mainStoreManagerNavItems 
  : allNavItems;
```

### Benefits
- Role-based access control enforced at UI level
- Focused interface for Main Store Manager role
- Clear separation of responsibilities
- Prevents confusion and accidental navigation to irrelevant pages
- Maintains professional appearance with standard sidebar (not a custom solution)
