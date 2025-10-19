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
   *  Get orders report with filters
   * Automatically filters by store for store managers
   */
  getReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const user = getCurrentUser();
      if (user && user.store_id) params.append('storeId', user.store_id);

      const response = await axios.get(`${API_BASE_URL}/report?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Get report summary
   */
  getReportSummary: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const user = getCurrentUser();
      if (user && user.store_id) params.append('storeId', user.store_id);

      const response = await axios.get(`${API_BASE_URL}/report/summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report summary:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Export report as PDF
   */
  exportPDF: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_BASE_URL}/report/export/pdf?${params.toString()}`, {
        responseType: 'blob',
      });

      // Trigger file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Quarterly Sales Report
   */
  getQuarterlySales: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/quarterly-sales`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quarterly sales:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Most Ordered Items (Top 10)
   */
  getTopOrderedItems: async (quarter, year) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/top-items`, {
        params: { quarter, year },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top ordered items:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  City & Route-wise Sales Breakdown
   */
  getCityRouteSales: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/city-route-sales`);
      return response.data;
    } catch (error) {
      console.error('Error fetching city/route sales:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Driver & Assistant Working Hours
   */
  getDriverAssistantHours: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/driver-hours`);
      return response.data;
    } catch (error) {
      console.error('Error fetching driver hours:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Truck Usage Analysis per Month
   */
  getTruckUsageReport: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/truck-usage`);
      return response.data;
    } catch (error) {
      console.error('Error fetching truck usage report:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   *  Customer Order History with Delivery Details
   */
  getCustomerOrderHistory: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/customer-history`, {
        params: { customerId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer order history:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default reportService;
