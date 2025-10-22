import api from './api';

/**
 * Fetch Monthly Revenue
 */
export const fetchMonthlyRevenue = async (monthKey) => {
  try {
    const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : '';
    const response = await api.get(`/dashboard/revenue${query}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || 'Failed to fetch monthly revenue. Please try again.';
    throw new Error(message);
  }
};

/**
 * Fetch New Orders Count
 */
export const fetchNewOrdersCount = async (monthKey) => {
  try {
    const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : '';
    const response = await api.get(`/dashboard/new-orders-count${query}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || 'Failed to fetch new orders count. Please try again.';
    throw new Error(message);
  }
};

/**
 * Fetch Completed Deliveries
 */
export const fetchCompletedDeliveries = async (monthKey) => {
  try {
    const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : '';
    const response = await api.get(`/dashboard/completed-deliveries${query}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || 'Failed to fetch completed deliveries. Please try again.';
    throw new Error(message);
  }
};

/**
 * Fetch Order History
 */
export const fetchOrderHistory = async () => {
  try {
    const response = await api.get('/dashboard/order-history');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || 'Failed to fetch order history. Please try again.';
    throw new Error(message);
  }
};

/**
 * Fetch Late Deliveries
 */
export const fetchLateDeliveries = async (monthKey) => {
  try {
    const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : '';
    const response = await api.get(`/dashboard/late-deliveries${query}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || 'Failed to fetch late deliveries. Please try again.';
    throw new Error(message);
  }
};

/**
 * Fetch System Alerts
 */
export const fetchSystemAlerts = async () => {
  try {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || 'Failed to fetch system alerts. Please try again.';
    throw new Error(message);
  }
};
