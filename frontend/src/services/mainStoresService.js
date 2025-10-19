const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

export const fetchPendingOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/main-stores/pending-orders`)

  if (!response.ok) {
    throw new Error('Failed to fetch pending orders')
  }

  return response.json()
}

export const fetchTrainSchedules = async () => {
  const response = await fetch(`${API_BASE_URL}/api/main-stores/train-schedules`)

  if (!response.ok) {
    throw new Error('Failed to fetch train schedules')
  }

  return response.json()
}

export const processOrder = async (orderId, tripId) => {
  const response = await fetch(`${API_BASE_URL}/api/main-stores/process-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId, tripId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to process order')
  }

  return response.json()
}

export const fetchScheduleOrders = async (tripId) => {
  const response = await fetch(`${API_BASE_URL}/api/main-stores/train-schedules/${tripId}/orders`)

  if (!response.ok) {
    throw new Error('Failed to fetch schedule orders')
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
