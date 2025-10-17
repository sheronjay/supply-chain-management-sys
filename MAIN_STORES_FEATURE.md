# Main Stores Feature Implementation

## Overview
A new "Main Stores" page has been added to the supply chain management system that allows store managers to process pending orders by assigning them to train schedules based on available capacity.

## Features Implemented

### 1. Database Schema Updates
**File: `docker/init.sql`**

#### Added to `train_schedules` table:
- `available_capacity` column (DECIMAL(10,2)) - Tracks remaining capacity for each train schedule
- Initially set to match the train's total capacity

#### New Junction Table: `train_schedule_orders`
- Links orders to train schedules
- Tracks when orders are assigned (`assigned_date`)
- Enforces referential integrity with cascading deletes

### 2. Backend API Endpoints
**Base URL: `/api/main-stores`**

#### GET `/pending-orders`
Returns all orders with status 'PLACED' along with:
- Customer information
- Store and sub-city details
- Total capacity required (calculated from order items)

#### GET `/train-schedules`
Returns all upcoming train schedules with:
- Train details (ID, name, capacity)
- Destination store
- Available capacity vs used capacity
- Only shows schedules from today onwards

#### POST `/process-order`
Assigns an order to a train schedule:
- **Request Body:** `{ orderId, tripId }`
- **Validations:**
  - Order and schedule must exist
  - Order destination must match train schedule destination
  - Sufficient capacity must be available
- **Actions:**
  - Creates entry in `train_schedule_orders` junction table
  - Updates `available_capacity` on the train schedule
  - Changes order status from 'PLACED' to 'SCHEDULED'
- **Returns:** Confirmation with capacity details

#### GET `/train-schedules/:tripId/orders`
Returns all orders assigned to a specific train schedule

### 3. Frontend Components

#### Main Stores Page (`/frontend/src/pages/MainStores/`)
- **Location:** Accessible via sidebar navigation
- **Features:**
  - Dashboard showing pending order statistics
  - Total pending orders count
  - Total capacity required
  - Total order value
  - Refresh functionality
  - Error handling and loading states

#### PendingOrdersTable Component
- Displays all pending orders in a table format
- Shows:
  - Order ID
  - Customer details (name, email)
  - Destination (city, sub-city)
  - Order date
  - Total price
  - Capacity required
  - Process button for each order
- Responsive design for mobile devices

#### ProcessOrderModal Component
- Modal dialog for processing orders
- **Features:**
  - Displays order summary
  - Lists available train schedules filtered by destination
  - Shows capacity availability for each schedule
  - Visual indicators:
    - Available schedules (green capacity indicator)
    - Insufficient capacity (red, disabled)
  - Prevents processing if capacity is insufficient
  - Real-time validation
  - Success/error feedback

### 4. Train Schedule Updates
**Modified: `frontend/src/pages/TrainSchedule/`**

#### Enhanced Features:
- Now fetches real data from backend API
- Displays:
  - Date and departure time
  - Train ID and name
  - **Used capacity** (highlighted in red)
  - **Available capacity** (highlighted in green)
  - **Total capacity** (in black)
  - Status (Available, Warning, Overbooked, At Capacity)
  - Destination city
- Automatic status calculation:
  - **Available:** < 90% capacity
  - **Warning:** 90-99% capacity
  - **At Capacity:** 100% capacity
  - **Overbooked:** > 100% capacity
- Dynamic alerts based on capacity usage
- Refresh functionality

### 5. Navigation Updates
- Added "Main Stores" to sidebar with warehouse icon
- Positioned between "My Orders" and "Train Schedule"
- Added routing in App.jsx

## Workflow

### Processing an Order:
1. Navigate to "Main Stores" page
2. View pending orders with their capacity requirements
3. Click "Process" on an order
4. Modal opens showing:
   - Order details and capacity requirement
   - Available train schedules for that destination
   - Capacity availability for each schedule
5. Select a compatible train schedule
6. Click "Process Order"
7. System validates and:
   - Updates available capacity
   - Assigns order to schedule
   - Changes order status to 'SCHEDULED'
8. Page refreshes to show updated pending orders

### Viewing Train Capacity:
1. Navigate to "Train Schedule" page
2. View all upcoming train schedules with:
   - Real-time capacity information
   - Color-coded capacity indicators
   - Status badges
3. Alerts displayed for overbooked or near-capacity trains
4. Click "Refresh Schedule" to reload data

## Files Created/Modified

### Database:
- `docker/init.sql` - Schema updates

### Backend:
- `backend/src/controllers/mainStores.controller.js` - New controller
- `backend/src/routes/mainStores.routes.js` - New routes
- `backend/src/app.js` - Route registration

### Frontend Services:
- `frontend/src/services/mainStoresService.js` - API calls

### Frontend Components:
- `frontend/src/pages/MainStores/MainStores.jsx`
- `frontend/src/pages/MainStores/MainStores.css`
- `frontend/src/components/mainStores/PendingOrdersTable/PendingOrdersTable.jsx`
- `frontend/src/components/mainStores/PendingOrdersTable/PendingOrdersTable.css`
- `frontend/src/components/mainStores/ProcessOrderModal/ProcessOrderModal.jsx`
- `frontend/src/components/mainStores/ProcessOrderModal/ProcessOrderModal.css`

### Frontend Updates:
- `frontend/src/pages/TrainSchedule/TrainSchedule.jsx` - Now fetches real data
- `frontend/src/pages/TrainSchedule/TrainSchedule.css` - Loading state styles
- `frontend/src/components/trainSchedule/ScheduleHeader/ScheduleHeader.jsx` - Refresh support
- `frontend/src/components/trainSchedule/ScheduleTable/ScheduleTable.jsx` - Capacity columns
- `frontend/src/components/trainSchedule/ScheduleTable/ScheduleTable.css` - Column styling
- `frontend/src/components/Sidebar/Sidebar.jsx` - Main Stores navigation
- `frontend/src/App.jsx` - Route configuration

## Technical Notes

### Capacity Calculation:
- Order capacity is calculated as: `SUM(order_items.quantity * products.space_consumption_rate)`
- Available capacity = Train capacity - Used capacity
- Used capacity = Train capacity - Available capacity (from database)

### Transaction Safety:
- Order processing uses database transactions
- Rollback on any validation failure
- Ensures data consistency

### Error Handling:
- Comprehensive validation on backend
- User-friendly error messages
- Loading and error states on frontend

## Next Steps (Optional Enhancements)
1. Add bulk order processing
2. Implement train schedule assignment optimization
3. Add capacity forecasting
4. Export functionality for reports
5. Email notifications when orders are processed
6. Add filters and search to pending orders table
7. Historical view of processed orders
