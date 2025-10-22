// src/services/mainStoresService.js
import api from './api';

/**
 * Get all pending orders
 */
export const fetchPendingOrders = async () => {
  try {
    const response = await api.get('/main-stores/pending-orders');
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to fetch pending orders');
  }
};

/**
 * Get all train schedules with capacity
 */
export const fetchTrainSchedules = async () => {
  try {
    const response = await api.get('/main-stores/train-schedules');
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to fetch train schedules');
  }
};

/**
 * Process an order (assign to train schedule)
 */
export const processOrder = async (orderId, tripId) => {
  try {
    const response = await api.post('/main-stores/process-order', { orderId, tripId });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to process order');
  }
};

/**
 * Get orders for a specific train schedule
 */
export const fetchScheduleOrders = async (tripId) => {
  try {
    const response = await api.get(`/main-stores/train-schedules/${tripId}/orders`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to fetch schedule orders');
  }

  return response.json()
}

// Product management functions
export const fetchAllProducts = async () => {
  try {
    const response = await api.get('/main-stores/products');
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to fetch products');
  }
};

export const addNewProduct = async (productData) => {
  try {
    const response = await api.post('/main-stores/products', productData);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to add product');
  }
};

export const updateProduct = async (productData) => {
  try {
    const response = await api.put('/main-stores/products', productData);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to update product');
  }
};
