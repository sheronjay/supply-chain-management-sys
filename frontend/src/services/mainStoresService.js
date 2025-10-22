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
  const response = await fetch(`${API_BASE_URL}/api/main-stores/products`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

export const addNewProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/api/main-stores/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add product')
  }

  return response.json()
}

export const updateProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/api/main-stores/products`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update product')
  }

  return response.json()
}
