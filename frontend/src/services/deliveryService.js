import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const deliveryService = {
  /**
   * Get all deliveries for the current user
   */
  getMyDeliveries: async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/deliveries/my-deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching my deliveries:', error)
      throw error
    }
  },

  /**
   * Get upcoming deliveries for the current user
   */
  getUpcomingDeliveries: async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/deliveries/upcoming`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching upcoming deliveries:', error)
      throw error
    }
  },

  /**
   * Update delivery status
   */
  updateDeliveryStatus: async (deliveryId, status) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `${API_URL}/api/deliveries/${deliveryId}/status`,
        { delivery_status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating delivery status:', error)
      throw error
    }
  }
}

export default deliveryService
