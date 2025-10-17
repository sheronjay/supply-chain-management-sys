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
