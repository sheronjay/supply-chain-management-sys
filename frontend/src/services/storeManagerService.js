const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all orders with status 'TRAIN' for a specific store
 */
export async function fetchStoreOrders(storeId = 'ST-CMB-01') {
  const response = await fetch(`${API_BASE_URL}/store-manager/orders/${storeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch store orders: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all orders with status 'IN-STORE' for a specific store (inventory)
 */
export async function fetchStoreInventory(storeId = 'ST-CMB-01') {
  const response = await fetch(`${API_BASE_URL}/store-manager/inventory/${storeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch store inventory: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Accept an order - update status from 'TRAIN' to 'IN-STORE'
 */
export async function acceptOrder(orderId, managerId = 'MGR-CMB-001') {
  const response = await fetch(
    `${API_BASE_URL}/store-manager/orders/${orderId}/accept`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ managerId }),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to accept order: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch all trucks for a specific store
 */
export async function fetchTrucks(storeId) {
  const response = await fetch(`${API_BASE_URL}/store-manager/trucks/${storeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trucks: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all drivers for a specific store
 */
export async function fetchDrivers(storeId) {
  const response = await fetch(`${API_BASE_URL}/store-manager/drivers/${storeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch drivers: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all assistants for a specific store
 */
export async function fetchAssistants(storeId) {
  const response = await fetch(`${API_BASE_URL}/store-manager/assistants/${storeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch assistants: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch delivery employees with working hours for a specific store
 */
export async function fetchDeliveryEmployees(storeId = 'ST-CMB-01') {
  const response = await fetch(`${API_BASE_URL}/store-manager/delivery-employees/${storeId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch delivery employees: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Assign an order to a truck with driver and assistant
 */
export async function assignOrderToTruck(orderId, truckId, driverId, assistantId) {
  const response = await fetch(
    `${API_BASE_URL}/store-manager/orders/${orderId}/assign-truck`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ truckId, driverId, assistantId }),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || `Failed to assign order: ${response.statusText}`);
  }
  
  return response.json();
}
