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
