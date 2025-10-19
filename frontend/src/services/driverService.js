// src/services/driverService.js
import api from './api';

export const driverService = {
  // Get all orders assigned to a driver
  getDriverOrders: async (driverId) => {
    try {
      const response = await api.get(`/driver/orders/${driverId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch driver orders');
    }
  },

  // Get driver's details including working hours
  getDriverDetails: async (driverId) => {
    try {
      const response = await api.get(`/driver/details/${driverId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch driver details');
    }
  },

  // Mark an order as delivered
  markOrderAsDelivered: async (orderId) => {
    try {
      const response = await api.put(`/driver/deliver/${orderId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to mark order as delivered');
    }
  },

  // Update driver's working hours
  updateWorkingHours: async (driverId, workingHours) => {
    try {
      const response = await api.put(`/driver/working-hours/${driverId}`, { workingHours });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update working hours');
    }
  },
};
