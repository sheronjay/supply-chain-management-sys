const API_BASE_URL = 'http://localhost:5000/api/driver';

export const driverService = {
  // Get all orders assigned to a driver
  getDriverOrders: async (driverId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${driverId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver orders');
    }
    return response.json();
  },

  // Get driver's details including working hours
  getDriverDetails: async (driverId) => {
    const response = await fetch(`${API_BASE_URL}/details/${driverId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver details');
    }
    return response.json();
  },

  // Mark an order as delivered
  markOrderAsDelivered: async (orderId, driverId) => {
    const response = await fetch(`${API_BASE_URL}/deliver/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ driverId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark order as delivered');
    }
    return response.json();
  },

  // Update driver's working hours
  updateWorkingHours: async (driverId, workingHours) => {
    const response = await fetch(`${API_BASE_URL}/working-hours/${driverId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workingHours }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update working hours');
    }
    return response.json();
  },
};
