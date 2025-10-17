# Truck Assignment Feature Implementation

## Overview
Implemented functionality for store managers to assign orders in inventory to trucks along with drivers and assistants. The system prevents assignment of drivers/assistants who have worked 40 or more hours, but still displays them in the dropdown for visibility. When assigned, the order status changes to 'TRUCK'.

## Changes Made

### 1. Database Schema Updates (`docker/init.sql`)

#### Removed `delivery_schedules` table
- **Deleted the entire `delivery_schedules` table** and all its data
- Removed the `order_delivery_tracking` view that depended on it
- The table was unnecessary as truck assignment can be tracked directly in the orders table

#### Modified `orders` table
- Added `truck_id` column (VARCHAR(255))
- Added `driver_id` column (VARCHAR(255))
- Added `assistant_id` column (VARCHAR(255))
- Added foreign key constraints for all three columns
- Added indexes for improved query performance

### 2. Backend Services (`backend/services/storeManager.service.js`)
Added four new functions:

- **`getTrucks(storeId)`**: Fetches all available trucks for a store
- **`getDrivers(storeId)`**: Fetches all drivers with working hours and a `can_assign` flag (0 if >= 40 hours)
- **`getAssistants(storeId)`**: Fetches all assistants with working hours and a `can_assign` flag (0 if >= 40 hours)
- **`assignOrderToTruck(orderId, truckId, driverId, assistantId)`**: 
  - Validates order status is 'IN-STORE'
  - Checks if driver/assistant have < 40 working hours
  - Updates order with truck_id, driver_id, and assistant_id
  - Changes order status to 'TRUCK'
  - No longer creates a separate delivery_schedules record

### 3. Backend Routes (`backend/src/routes/storeManager.routes.js`)
Added five new endpoints:

- `GET /api/store-manager/trucks/:storeId` - Get trucks for a store
- `GET /api/store-manager/drivers/:storeId` - Get drivers for a store
- `GET /api/store-manager/assistants/:storeId` - Get assistants for a store
- `POST /api/store-manager/orders/:orderId/assign-truck` - Assign order to truck with driver and assistant

### 4. Backend Controllers (`backend/src/controllers/storeManager.controller.js`)
Added four new controller functions corresponding to the routes above.

### 5. Frontend Services (`frontend/src/services/storeManagerService.js`)
Added four new API call functions:

- `fetchTrucks(storeId)`
- `fetchDrivers(storeId)`
- `fetchAssistants(storeId)`
- `assignOrderToTruck(orderId, truckId, driverId, assistantId)`

### 6. New Component: AssignTruckModal
**File**: `frontend/src/components/storeManager/AssignTruckModal/AssignTruckModal.jsx`

Features:
- Displays order details (Order ID, Customer, Sub-City, Capacity)
- Three dropdown selects for:
  - Trucks (showing registration, capacity, and used hours)
  - Drivers (showing name, working hours, disabled if >= 40 hours)
  - Assistants (showing name, working hours, disabled if >= 40 hours)
- Visual indicators for drivers/assistants who cannot be assigned (grayed out with "(40+ hours)" label)
- Form validation ensuring all three selections are made
- Error handling and loading states
- Success callback to refresh inventory after assignment

**File**: `frontend/src/components/storeManager/AssignTruckModal/AssignTruckModal.css`

Styling includes:
- Modal overlay with fade-in animation
- Responsive design (mobile-friendly)
- Disabled option styling for 40+ hour employees
- Professional form styling with proper spacing
- Loading spinners and error messages

### 7. Updated Component: StoreInventoryTable
**File**: `frontend/src/components/storeManager/StoreInventoryTable/StoreInventoryTable.jsx`

Changes:
- Added "Actions" column to the table
- Added "Assign Truck" button with truck icon for each order
- Integrated AssignTruckModal component
- Added state management for modal open/close
- Added `storeId` and `onRefresh` props
- Callback to refresh inventory after successful assignment

**File**: `frontend/src/components/storeManager/StoreInventoryTable/StoreInventoryTable.css`

Added styles for:
- `.actions-cell` - Center-aligned actions column
- `.btn-assign-truck` - Blue button with hover effects
- `.truck-icon` - Truck SVG icon
- Responsive adjustments for mobile devices

### 8. Updated Page: StoreManager
**File**: `frontend/src/pages/StoreManager/StoreManager.jsx`

Changes:
- Passed `storeId` prop to `StoreInventoryTable`
- Passed `loadStoreInventory` as `onRefresh` prop for automatic refresh after assignment

## Key Features

### 40-Hour Working Limit
- Drivers and assistants with 40+ working hours **cannot be assigned** (disabled in dropdown)
- They are **still visible** in the dropdown with working hours displayed
- Clear visual indicator: "(40+ hours)" label and grayed-out appearance
- Backend validation ensures they cannot be assigned even if client-side validation is bypassed

### User Experience
- Clean, intuitive modal interface
- Real-time feedback with loading states
- Clear error messages
- Automatic refresh of inventory after successful assignment
- Responsive design for all screen sizes

### Status Flow
1. Order arrives → Status: 'TRAIN'
2. Manager accepts → Status: 'IN-STORE' (appears in inventory)
3. Manager assigns truck → Status: 'TRUCK' (removed from inventory, assigned to truck with driver and assistant)

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/store-manager/trucks/:storeId` | Get available trucks |
| GET | `/api/store-manager/drivers/:storeId` | Get drivers with hours |
| GET | `/api/store-manager/assistants/:storeId` | Get assistants with hours |
| POST | `/api/store-manager/orders/:orderId/assign-truck` | Assign order to truck |

## Database Changes Required

To apply the database changes, you need to **recreate the database** with the updated schema in `docker/init.sql`:

```bash
docker-compose down
docker-compose up -d
```

**OR** if you want to migrate existing data, run this SQL migration:

```sql
-- Add new columns to orders table
ALTER TABLE orders 
  ADD COLUMN truck_id VARCHAR(255),
  ADD COLUMN driver_id VARCHAR(255),
  ADD COLUMN assistant_id VARCHAR(255),
  ADD KEY idx_orders_truck (truck_id),
  ADD KEY idx_orders_driver (driver_id),
  ADD KEY idx_orders_assistant (assistant_id),
  ADD CONSTRAINT fk_orders_truck 
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_orders_driver 
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_orders_assistant 
    FOREIGN KEY (assistant_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL;

-- Drop the old delivery_schedules table
DROP VIEW IF EXISTS order_delivery_tracking;
DROP TABLE IF EXISTS delivery_schedules;
```

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend compiles without errors
- [ ] Can view inventory tab in Store Manager page
- [ ] "Assign Truck" button appears for each order
- [ ] Modal opens when clicking "Assign Truck"
- [ ] Trucks, drivers, and assistants load correctly
- [ ] Drivers/assistants with 40+ hours are disabled
- [ ] Cannot submit without selecting all three fields
- [ ] Successful assignment removes order from inventory
- [ ] Error messages display for validation failures
- [ ] Modal closes properly after assignment

## Future Enhancements

- Track delivery completion and update working hours
- Add delivery scheduling with dates/times
- Route optimization for multiple deliveries
- Notification system for drivers/assistants
- Driver/assistant availability calendar
