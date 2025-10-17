# User Orders Page Update

## Summary
Updated the User Orders page to work with the current database schema. The page now uses hardcoded customer data (CUST-0001: Sunrise Wholesale) until the login system is implemented.

## Changes Made

### 1. Frontend - UserOrders.jsx
**File:** `/frontend/src/pages/userOrders/UserOrders.jsx`

#### Updated Features:
- **Hardcoded Customer Details:**
  - Customer ID: `CUST-0001`
  - Customer Name: `Sunrise Wholesale`
  - City: `Colombo`
  - Store ID: `ST-CMB-01` (Colombo store)
  - Sub-City ID: `SC-CMB-001` (Pettah)

- **Order Fetching:**
  - Fetches orders for the hardcoded customer from `/api/orders/user/CUST-0001`
  - Shows loading state while fetching
  - Displays error message if fetch fails

- **Order Creation:**
  - Sends customer ID, store ID, and sub-city ID with order data
  - Status is set to "PENDING" when order is created
  - Refreshes order list after successful creation

- **Status Mapping:**
  - `PENDING` → yellow/amber badge
  - `SCHEDULED` → blue badge
  - `PLACED` → indigo badge
  - `DELIVERED` → green badge (completed)
  - `CANCELLED` → red badge

### 2. Frontend - AddOrderModal.jsx
**File:** `/frontend/src/components/orders/AddOrderModal/AddOrderModal.jsx`

#### Updated Features:
- **Removed Customer Name Field:**
  - Now displays customer name as read-only info
  - Customer is pre-selected based on hardcoded value

- **Updated Route Selection:**
  - Changed to "Delivery Sub-City" dropdown
  - Organized sub-cities by parent city using optgroups
  - Options match the database sub_cities table:
    - Colombo: Pettah, Thimbirigasyaya, Dehiwala
    - Kandy: Peradeniya, Katugastota, Gampola
    - Negombo: Kochchikade, Katana, Wattala
    - Galle: Unawatuna, Hikkaduwa, Ambalangoda
    - Matara: Weligama, Hakmana, Dikwella
    - Jaffna: Nallur, Chavakachcheri
    - Trincomalee: Uppuveli, Kinniya

- **Product Selection:**
  - Fetches products from `/api/orders/products/list`
  - Auto-populates price when product is selected
  - Supports 10 products from the database

### 3. Backend - order.service.js
**File:** `/backend/services/order.service.js`

#### Updated Database Queries:
- **Removed References to Non-Existent Tables:**
  - Removed `truck_routes` table references
  - Removed `route_id` field
  - Updated to use `sub_city_id` instead

- **Updated Join Queries:**
  ```sql
  LEFT JOIN stores s ON o.store_id = s.store_id
  LEFT JOIN sub_cities sc ON o.sub_city_id = sc.sub_city_id
  ```

- **Route Display:**
  - Now shows sub-city name or store city as route
  - Falls back to "Unknown" if no location data

- **Order Creation:**
  - Validates customer exists before creating order
  - Generates order ID with format: `ORD-XXXXXXXX`
  - Sets status to "PENDING" by default
  - Inserts into orders table with:
    - `customer_id`
    - `store_id`
    - `sub_city_id`
    - `ordered_date`
    - `total_price`
    - `status`
  - Validates products exist before adding order items
  - Throws error if product not found

### 4. CSS Updates

#### UserOrders.css
- Added `.customer-info` styling for customer details display
- Added `.customer-name` styling for customer ID subtitle
- Added `.loading-message` and `.error-message` styles
- Made header responsive with flex layout

#### AddOrderModal.css
- Added `.customer-info-display` styling:
  - Light gray background
  - Blue left border
  - Padding and border radius
  - Clear typography

#### UserOrdersTable.css
- Added status badge styles for:
  - `.status-badge.scheduled` (blue)
  - `.status-badge.placed` (indigo)
  - Kept existing: pending, completed, cancelled

## Database Schema Used

### Tables:
1. **customers** - Customer information
2. **orders** - Order records
3. **order_items** - Line items for each order
4. **products** - Product catalog
5. **stores** - Store locations
6. **sub_cities** - Sub-city delivery areas

### Key Fields:
- `orders.customer_id` → foreign key to customers
- `orders.store_id` → foreign key to stores
- `orders.sub_city_id` → foreign key to sub_cities
- `orders.status` → PENDING, SCHEDULED, PLACED, DELIVERED, CANCELLED

## Products Available:
1. Detergent 1kg - LKR 850.00
2. Shampoo 500ml - LKR 950.00
3. Bath Soap 100g - LKR 180.00
4. Toothpaste 120g - LKR 320.00
5. Ceylon Tea 200g - LKR 700.00
6. UHT Milk 1L - LKR 380.00
7. Biscuits 200g - LKR 250.00
8. Floor Cleaner 1L - LKR 620.00
9. Cooking Oil 5L - LKR 2200.00
10. Rice 10kg - LKR 1500.00

## Testing Instructions

1. **Start the Application:**
   ```bash
   # Start backend
   cd backend
   npm start
   
   # Start frontend
   cd frontend
   npm run dev
   ```

2. **Navigate to User Orders:**
   - Access the User Orders page from the sidebar
   - You should see "Customer: Sunrise Wholesale (CUST-0001)"

3. **View Existing Orders:**
   - Orders for CUST-0001 will be displayed
   - Click "View Details" to see order items

4. **Create New Order:**
   - Click "Add New Order" button
   - Customer info is displayed (read-only)
   - Select a delivery sub-city
   - Add products (prices auto-fill)
   - Set quantities
   - Click "Create Order"
   - Order should appear in the list with "PENDING" status

## Future Enhancements

Once login is implemented:
1. Replace hardcoded customer ID with logged-in user's customer ID
2. Fetch customer details from `localStorage` or authentication context
3. Add customer profile page
4. Add order tracking and delivery status updates
5. Add order cancellation functionality
6. Add filters for order status and date range
