// src/services/storeManagerService.js
import api from './api';

/**
 * Fetch all orders with status 'TRAIN' for a specific store
 */
export async function fetchStoreOrders(storeId = 'ST-CMB-01') {
  try {
    const response = await api.get(`/store-manager/orders/${storeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch store orders');
  }
}

/**
 * Fetch all orders with status 'IN-STORE' for a specific store (inventory)
 */
export async function fetchStoreInventory(storeId = 'ST-CMB-01') {
  try {
    const response = await api.get(`/store-manager/inventory/${storeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch store inventory');
  }
}

/**
 * Accept an order - update status from 'TRAIN' to 'IN-STORE'
 */
export async function acceptOrder(orderId, managerId = 'MGR-CMB-001') {
  try {
    const response = await api.patch(`/store-manager/orders/${orderId}/accept`, { managerId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to accept order');
  }
}

/**
 * Fetch all trucks for a specific store
 */
export async function fetchTrucks(storeId) {
  try {
    const response = await api.get(`/store-manager/trucks/${storeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch trucks');
  }
}

/**
 * Fetch all drivers for a specific store
 */
export async function fetchDrivers(storeId) {
  try {
    const response = await api.get(`/store-manager/drivers/${storeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch drivers');
  }
}

/**
 * Fetch all assistants for a specific store
 */
export async function fetchAssistants(storeId) {
  try {
    const response = await api.get(`/store-manager/assistants/${storeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch assistants');
  }
}

/**
 * Fetch delivery employees with working hours for a specific store
 */
export async function fetchDeliveryEmployees(storeId = 'ST-CMB-01') {
  try {
    const response = await api.get(`/store-manager/delivery-employees/${storeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch delivery employees');
  }
}

/**
 * Assign an order to a truck with driver and assistant
 */
export async function assignOrderToTruck(orderId, truckId, driverId, assistantId) {
  try {
    const response = await api.post(`/store-manager/orders/${orderId}/assign-truck`, {
      truckId,
      driverId,
      assistantId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to assign order');
  }
}
