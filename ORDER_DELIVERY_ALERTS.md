# Order Delivery Alerts for Store Managers

## Overview
A database trigger-based alert system that automatically notifies store managers when orders are delivered. The system creates persistent alerts in the database and provides a full-featured API for managing these alerts.

## Database Changes

### New Table: `store_manager_alerts`
```sql
CREATE TABLE IF NOT EXISTS store_manager_alerts (
  alert_id        INT AUTO_INCREMENT PRIMARY KEY,
  store_id        VARCHAR(255) NOT NULL,
  order_id        VARCHAR(255),
  alert_type      VARCHAR(50) NOT NULL,           -- 'ORDER_DELIVERED', 'LOW_STOCK', etc.
  title           VARCHAR(255) NOT NULL,
  message         TEXT NOT NULL,
  status          VARCHAR(20) DEFAULT 'unread',    -- 'unread' or 'read'
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Foreign keys and indexes...
) ENGINE=InnoDB;
```

**Key Features:**
- Stores persistent alerts for store managers
- Links alerts to stores and orders
- Tracks read/unread status
- Supports multiple alert types (extensible)
- Automatically timestamps alert creation

### New Trigger: `after_order_delivered`
```sql
CREATE TRIGGER after_order_delivered
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.status = 'DELIVERED' AND OLD.status != 'DELIVERED' AND NEW.store_id IS NOT NULL THEN
    INSERT INTO store_manager_alerts (
      store_id, order_id, alert_type, title, message, status
    ) VALUES (
      NEW.store_id,
      NEW.order_id,
      'ORDER_DELIVERED',
      'Order Delivered Successfully',
      CONCAT('Order ', NEW.order_id, ' has been successfully delivered to the customer.'),
      'unread'
    );
  END IF;
END
```

**Trigger Logic:**
- ✅ Fires only when order status changes **TO** 'DELIVERED'
- ✅ Only creates alerts for orders with a valid `store_id`
- ✅ Excludes main store manager (who has `store_id = NULL`)
- ✅ Creates one alert per delivery per store

## Backend API

### Service Layer: `backend/services/alert.service.js`
Provides data access methods:
- `getStoreAlerts(storeId, status)` - Fetch alerts with optional filtering
- `getUnreadAlertCount(storeId)` - Get count of unread alerts
- `markAlertAsRead(alertId, storeId)` - Mark single alert as read
- `markAllAlertsAsRead(storeId)` - Mark all alerts as read
- `deleteAlert(alertId, storeId)` - Delete an alert

### Controller: `backend/src/controllers/alert.controller.js`
Handles HTTP requests and responses for alert operations.

### Routes: `backend/src/routes/alert.routes.js`
Protected endpoints requiring authentication and store manager authorization:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/:storeId` | Get all alerts (optional `?status=unread` query) |
| GET | `/api/alerts/:storeId/count` | Get unread alert count |
| PATCH | `/api/alerts/:storeId/:alertId/read` | Mark specific alert as read |
| PATCH | `/api/alerts/:storeId/read-all` | Mark all alerts as read |
| DELETE | `/api/alerts/:storeId/:alertId` | Delete an alert |

### Example API Usage
```bash
# Get all unread alerts for Colombo store
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/alerts/ST-CMB-01?status=unread

# Get unread count
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/alerts/ST-CMB-01/count

# Mark alert as read
curl -X PATCH -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/alerts/ST-CMB-01/123/read
```

## Frontend Integration

### Service Functions: `frontend/src/services/storeManagerService.js`
Added functions to interact with the alerts API:
- `fetchStoreAlerts(storeId, status)` - Fetch alerts
- `fetchUnreadAlertCount(storeId)` - Get unread count
- `markAlertAsRead(storeId, alertId)` - Mark as read
- `markAllAlertsAsRead(storeId)` - Mark all as read
- `deleteAlert(storeId, alertId)` - Delete alert

### Integration Example
```javascript
import { fetchStoreAlerts, markAlertAsRead } from '../../services/storeManagerService';

// Fetch unread alerts
const alerts = await fetchStoreAlerts('ST-CMB-01', 'unread');

// Mark an alert as read
await markAlertAsRead('ST-CMB-01', alertId);
```

## Security Features

✅ **Authentication Required**: All endpoints protected by `authenticateUser` middleware  
✅ **Authorization**: `authorizeStoreManager` ensures only store managers can access  
✅ **Store Isolation**: Alert operations validate `storeId` to prevent cross-store access  
✅ **SQL Injection Protection**: Parameterized queries throughout  
✅ **Main Store Manager Excluded**: Trigger logic excludes alerts for main store manager

## How It Works

### Workflow
1. **Order Status Update**: Driver or system updates order status to 'DELIVERED'
2. **Trigger Fires**: Database trigger automatically executes
3. **Alert Created**: New row inserted into `store_manager_alerts` table
4. **Store Manager Notified**: Alert appears in store manager dashboard
5. **Mark as Read**: Store manager can view and mark alerts as read
6. **Optional Deletion**: Alerts can be deleted if needed

### Example Scenario
```
1. Driver delivers Order ORD-0025 to customer (store: ST-CMB-01)
2. Driver updates order status to 'DELIVERED'
3. Trigger fires: INSERT INTO store_manager_alerts (
     store_id: 'ST-CMB-01',
     order_id: 'ORD-0025',
     alert_type: 'ORDER_DELIVERED',
     title: 'Order Delivered Successfully',
     message: 'Order ORD-0025 has been successfully delivered to the customer.',
     status: 'unread'
   )
4. Store manager logs in and sees notification badge
5. Clicks to view alert details
6. Marks alert as read
```

## Testing the Feature

### 1. Reset Database (includes new trigger)
```bash
cd /home/sheron/Documents/supply-chain-management-sys
docker-compose down -v
docker-compose up -d
```

### 2. Update an Order Status
```sql
-- Connect to DB via Adminer (http://localhost:8080)
UPDATE orders 
SET status = 'DELIVERED' 
WHERE order_id = 'ORD-0001' AND store_id = 'ST-CMB-01';
```

### 3. Check Alert Created
```sql
SELECT * FROM store_manager_alerts WHERE order_id = 'ORD-0001';
```

### 4. Test API Endpoints
```bash
# Start backend
cd backend && npm run dev

# Test alerts endpoint (replace <token> with valid JWT)
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/alerts/ST-CMB-01
```

## Future Enhancements

### Extensibility
The system is designed to support additional alert types:
- `LOW_STOCK` - Inventory alerts
- `PENDING_ORDER` - Orders needing attention
- `TRUCK_MAINTENANCE` - Fleet alerts
- `DELIVERY_DELAYED` - SLA breach alerts

Simply add more triggers or application logic to insert alerts with different `alert_type` values.

### Frontend Components
To fully integrate into the store manager dashboard, consider:
- Alert badge showing unread count
- Alert dropdown/modal for viewing alerts
- Auto-refresh to poll for new alerts
- Toast notifications for real-time alerts

## Files Modified/Created

### Backend
- ✅ `docker/init.sql` - Added table and trigger
- ✅ `backend/services/alert.service.js` - New service layer
- ✅ `backend/src/controllers/alert.controller.js` - New controller
- ✅ `backend/src/routes/alert.routes.js` - New routes
- ✅ `backend/src/app.js` - Registered alert routes

### Frontend
- ✅ `frontend/src/services/storeManagerService.js` - Added alert functions

### Documentation
- ✅ `ORDER_DELIVERY_ALERTS.md` - This file

## Benefits

1. **Automatic Notifications**: No manual intervention needed
2. **Persistent History**: Alerts stored in database
3. **Audit Trail**: Track when orders were delivered
4. **Scalable**: Supports multiple stores and alert types
5. **Real-time**: Triggers fire immediately on status change
6. **Secure**: Role-based access control
7. **Maintainable**: Clean separation of concerns

## Troubleshooting

### Trigger Not Firing
- Verify trigger exists: `SHOW TRIGGERS LIKE 'orders';`
- Check order has valid `store_id`
- Ensure status changes FROM non-'DELIVERED' TO 'DELIVERED'

### Alerts Not Appearing
- Verify alerts table exists: `DESCRIBE store_manager_alerts;`
- Check data: `SELECT * FROM store_manager_alerts;`
- Verify API endpoint is accessible

### Authorization Errors
- Ensure user has 'Store Manager' role
- Check JWT token is valid
- Verify `storeId` matches authenticated user's store

---

**Last Updated**: October 22, 2025  
**Author**: GitHub Copilot
