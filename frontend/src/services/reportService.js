import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Get store_id from logged-in user
      const user = getCurrentUser();
      if (user && user.store_id) {
        params.append('storeId', user.store_id);
      }

      const response = await axios.get(`${API_BASE_URL}/reports?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get report summary
   * Automatically filters by store for store managers
   */
  getReportSummary: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      // Get store_id from logged-in user
      const user = getCurrentUser();
      if (user && user.store_id) {
        params.append('storeId', user.store_id);
      }

      const response = await axios.get(`${API_BASE_URL}/reports/summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report summary:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default reportService;
