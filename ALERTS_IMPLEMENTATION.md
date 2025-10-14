# Dynamic Alerts System Implementation

## Overview
Implemented a dynamic, real-time alerts system that pulls data from the database to show critical supply chain issues on the dashboard.

## Alerts Implemented

### 1. **Late Deliveries Alert**
- **Condition**: Orders delivered more than 14 days after order date (SLA breach)
- **Status Levels**: 
  - High (red): More than 5 late deliveries
  - Medium (yellow): 1-5 late deliveries
- **Example**: "Late Deliveries Detected - 2 orders exceeded the 14-day SLA window this month."

### 2. **Low Inventory Alert**
- **Condition**: Products with stock below 20% of their quarterly order average
- **Status Levels**:
  - High (red): More than 2 products low on stock
  - Medium (yellow): 1-2 products low on stock
- **Example**: "Low Inventory Alert - 3 products running low: Detergent 1kg, Shampoo 500ml, Ceylon Tea 200g."

### 3. **Pending Orders Alert**
- **Condition**: Orders in 'PLACED' status for more than 2 days without scheduling
- **Status Levels**:
  - High (red): More than 10 pending orders
  - Medium (yellow): 1-10 pending orders
- **Example**: "Pending Orders Require Attention - 2 orders have been unscheduled for more than 2 days."

### 4. **Fleet Maintenance Alert**
- **Condition**: Trucks with usage hours exceeding 500 hours
- **Status**: Low (informational)
- **Example**: "Fleet Maintenance Due - Vehicles WP-NA-1234, SP-KM-9876 have high usage hours and may need inspection."

### 5. **All Clear Alert**
- **Condition**: When no issues are detected
- **Status**: Info
- **Example**: "All Systems Normal - No critical issues detected. Operations running smoothly."

## API Endpoint
**GET** `/api/dashboard/alerts`

Returns an array of alert objects with structure:
```json
{
  "id": "alert-xxx",
  "title": "Alert Title",
  "description": "Detailed description",
  "status": "High|Medium|Low|Info",
  "tone": "warning|caution|positive"
}
```

## Files Modified

### Backend
1. **`backend/src/controllers/dashboardController.js`**
   - Added `getSystemAlerts()` function
   - Queries database for various alert conditions
   - Returns dynamic alerts based on real data

2. **`backend/src/routes/dashboard.routes.js`**
   - Added route: `router.get('/alerts', getSystemAlerts)`

### Frontend
3. **`frontend/src/services/dashboardService.js`**
   - Added `fetchSystemAlerts()` function
   - Fetches alerts from API endpoint

4. **`frontend/src/pages/Dashboard/Dashboard.jsx`**
   - Replaced static alerts with dynamic state
   - Fetches alerts on component mount
   - Updates alerts in real-time with error handling

## How It Works

1. When the dashboard loads, it fetches alerts from the backend API
2. The backend queries the database for:
   - Late deliveries (from `order_delivery_tracking` view)
   - Low stock products (from `products` table)
   - Pending orders (from `orders` table with status 'PLACED')
   - High-usage trucks (from `trucks` table)
3. Alerts are generated dynamically based on current data
4. The frontend displays alerts in the AlertsCard component
5. Alert severity (High/Medium/Low) is determined by thresholds
6. Visual styling (warning/caution/positive) matches the severity

## Benefits

- **Real-time monitoring**: Alerts update based on actual database state
- **Actionable insights**: Each alert provides specific information about what needs attention
- **Priority-based**: High-priority issues are highlighted with appropriate status levels
- **Comprehensive coverage**: Monitors multiple critical areas of the supply chain
- **Error resilient**: Falls back gracefully if API calls fail

## Testing

To test the alerts API directly:
```bash
curl http://localhost:5000/api/dashboard/alerts
```

## Future Enhancements

Potential improvements:
- Add configurable thresholds for alerts
- Implement alert dismissal/acknowledgment
- Add historical alert tracking
- Email/SMS notifications for critical alerts
- Alert filtering by category or severity
- Detailed drill-down views for each alert type
