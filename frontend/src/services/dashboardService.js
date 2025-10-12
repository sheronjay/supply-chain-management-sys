const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

export const fetchMonthlyRevenue = async (monthKey) => {
  const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : ''
  const response = await fetch(`${API_BASE_URL}/api/dashboard/revenue${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch monthly revenue')
  }

  return response.json()
}