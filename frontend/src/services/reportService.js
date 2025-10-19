// src/services/reportService.js
import api from './api'; // Use api.js for baseURL + JWT

/**
 * Get current user from localStorage
 */
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const reportService = {
  /**
   * Get orders report with filters
   * Automatically filters by store for store managers
   */
  getReports: async (filters = {}) => {
    try {
      const params = {};

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch reports';
      throw new Error(message);
    }
  },

  /**
   * Get report summary
   * Automatically filters by store for store managers
   */
  getReportSummary: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/summary', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch report summary';
      throw new Error(message);
    }
  },
};

export default reportService;
