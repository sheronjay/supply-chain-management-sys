# Order Creation API Flow

## Frontend Request (UserOrders.jsx → AddOrderModal.jsx)

### User Action:
1. User clicks "Add New Order" button
2. Modal opens with customer info displayed (read-only)
3. User selects delivery sub-city
4. User adds products and quantities
5. Prices auto-populate from product database
6. User clicks "Create Order"

### Data Sent to Backend:
```javascript
POST http://localhost:5000/api/orders

Headers:
  Content-Type: application/json

Body:
{
  "customerId": "CUST-0001",           // Hardcoded: Sunrise Wholesale
  "customerName": "Sunrise Wholesale",  // For reference
  "storeId": "ST-CMB-01",              // Colombo store
  "subCityId": "SC-CMB-001",           // Pettah sub-city
  "items": [
    {
      "name": "Detergent 1kg",         // Product name from dropdown
      "qty": 5,                         // User input
      "price": 850.00                   // Auto-populated from DB
    },
    {
      "name": "Ceylon Tea 200g",
      "qty": 10,
      "price": 700.00
    }
  ],
  "totalAmount": 11250.00,             // Calculated: (5*850) + (10*700)
  "status": "PENDING",                 // Always PENDING for new orders
  "orderedDate": "2025-10-17"          // Current date
}
```

## Backend Processing (order.service.js)

### Step 1: Validate Customer
```sql
SELECT customer_id FROM customers WHERE customer_id = 'CUST-0001'
```
- If not found: throw error
- If found: continue

### Step 2: Generate Order ID
```javascript
const orderId = 'ORD-' + uuidv4().substring(0, 8).toUpperCase();
// Example: 'ORD-A3F2B1C4'
```

### Step 3: Insert Order
```sql
INSERT INTO orders 
  (order_id, customer_id, store_id, sub_city_id, ordered_date, total_price, status) 
VALUES 
  ('ORD-A3F2B1C4', 'CUST-0001', 'ST-CMB-01', 'SC-CMB-001', '2025-10-17', 11250.00, 'PENDING')
```

### Step 4: Insert Order Items
For each item in the array:

```sql
-- Find product
SELECT product_id, unit_price FROM products WHERE product_name = 'Detergent 1kg'
-- Returns: PRD-DET-1KG, 850.00

-- Insert order item
INSERT INTO order_items 
  (order_id, product_id, quantity, item_capacity, unit_price) 
VALUES 
  ('ORD-A3F2B1C4', 'PRD-DET-1KG', 5, NULL, 850.00)
```

Repeat for each product:
- Ceylon Tea 200g → PRD-TEA-200, qty: 10, price: 700.00

### Step 5: Commit Transaction
- If all successful: commit
- If any error: rollback

## Backend Response

### Success Response (201 Created):
```json
{
  "orderId": "ORD-A3F2B1C4",
  "customerId": "CUST-0001",
  "message": "Order created successfully",
  "totalAmount": 11250.00
}
```

### Error Response (400/500):
```json
{
  "message": "Customer CUST-0001 not found"
}
```
OR
```json
{
  "message": "Product 'Invalid Product' not found"
}
```

## Frontend Update After Success

1. Alert shown: "Order created successfully!"
2. `fetchOrders()` called to refresh the list
3. Modal closes
4. New order appears at top of table with:
   - Order ID: ORD-A3F2B1C4
   - Customer: Sunrise Wholesale
   - Status: PENDING (yellow badge)
   - Route: Pettah (or Colombo if sub_city not set)
   - Order Date: 2025-10-17
   - Total: LKR 11,250.00

## View Order Details

When user clicks "View Details":
```javascript
GET http://localhost:5000/api/orders/user/CUST-0001
```

Returns array of orders with items:
```json
[
  {
    "id": "ORD-A3F2B1C4",
    "customer": "Sunrise Wholesale",
    "customerId": "CUST-0001",
    "storeId": "ST-CMB-01",
    "subCityId": "SC-CMB-001",
    "route": "Pettah",
    "deliveryDate": "2025-10-17",
    "status": "PENDING",
    "totalAmount": 11250.00,
    "items": [
      {
        "name": "Detergent 1kg",
        "qty": 5,
        "price": 850.00,
        "amount": 4250.00
      },
      {
        "name": "Ceylon Tea 200g",
        "qty": 10,
        "price": 700.00,
        "amount": 7000.00
      }
    ]
  }
]
```

## Database Tables After Order Creation

### orders table:
| order_id | customer_id | store_id | sub_city_id | ordered_date | total_price | status |
|----------|-------------|----------|-------------|--------------|-------------|---------|
| ORD-A3F2B1C4 | CUST-0001 | ST-CMB-01 | SC-CMB-001 | 2025-10-17 | 11250.00 | PENDING |

### order_items table:
| order_id | product_id | quantity | item_capacity | unit_price |
|----------|------------|----------|---------------|------------|
| ORD-A3F2B1C4 | PRD-DET-1KG | 5 | NULL | 850.00 |
| ORD-A3F2B1C4 | PRD-TEA-200 | 10 | NULL | 700.00 |

## Status Progression (Future)

1. **PENDING** - Order created, awaiting store manager approval
2. **PLACED** - Order approved and confirmed
3. **SCHEDULED** - Assigned to delivery route/truck
4. **DELIVERED** - Successfully delivered to customer
5. **CANCELLED** - Order cancelled (by customer or store)
