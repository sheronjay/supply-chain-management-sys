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

  /**
   * Get quarterly sales report by value
   */
  getQuarterlySalesValue: async (year) => {
    try {
      const params = {};
      if (year) params.year = year;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/quarterly-sales-value', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch quarterly sales value report';
      throw new Error(message);
    }
  },

  /**
   * Get quarterly sales report by volume
   */
  getQuarterlySalesVolume: async (year) => {
    try {
      const params = {};
      if (year) params.year = year;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/quarterly-sales-volume', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch quarterly sales volume report';
      throw new Error(message);
    }
  },

  /**
   * Get most ordered items in a quarter
   */
  getMostOrderedItems: async (year, quarter) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/most-ordered-items', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch most ordered items report';
      throw new Error(message);
    }
  },

  /**
   * Get driver and assistant working hours report
   */
  getWorkingHoursReport: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/working-hours', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch working hours report';
      throw new Error(message);
    }
  },

  /**
   * Get truck usage analysis report
   */
  getTruckUsageReport: async (year, month) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/truck-usage', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch truck usage report';
      throw new Error(message);
    }
  },

  /**
   * Get customer order history report
   */
  getCustomerOrderHistory: async (customerId, startDate, endDate) => {
    try {
      const params = {};
      if (customerId) params.customerId = customerId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const user = getCurrentUser();
      if (user && user.store_id) params.storeId = user.store_id;

      const response = await api.get('/reports/customer-order-history', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch customer order history report';
      throw new Error(message);
    }
  },
};

export default reportService;
