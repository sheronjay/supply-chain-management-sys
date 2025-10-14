const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

export const fetchMonthlyRevenue = async (monthKey) => {
  const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : ''
  const response = await fetch(`${API_BASE_URL}/api/dashboard/revenue${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch monthly revenue')
  }

  return response.json()
}

export const fetchNewOrdersCount = async (monthKey) => {
  const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : ''
  const response = await fetch(`${API_BASE_URL}/api/dashboard/new-orders-count${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch new orders count')
  }

  return response.json()
}

export const fetchCompletedDeliveries = async (monthKey) => {
  const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : ''
  const response = await fetch(`${API_BASE_URL}/api/dashboard/completed-deliveries${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch completed deliveries')
  }

  return response.json()
}

export const fetchOrderHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/order-history`)

  if (!response.ok) {
    throw new Error('Failed to fetch order history')
  }

  return response.json()
}

export const fetchLateDeliveries = async (monthKey) => {
  const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : ''
  const response = await fetch(`${API_BASE_URL}/api/dashboard/late-deliveries${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch late deliveries')
  }

  return response.json()
}
  