import { useState, useEffect } from 'react'
import { fetchTrainSchedules } from '../../services/mainStoresService'
import ScheduleHeader from '../../components/trainSchedule/ScheduleHeader/ScheduleHeader'
import ScheduleAlerts from '../../components/trainSchedule/ScheduleAlerts/ScheduleAlerts'
import ScheduleTable from '../../components/trainSchedule/ScheduleTable/ScheduleTable'
import './TrainSchedule.css'

const TrainSchedule = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    loadTrainSchedules()
  }, [])

  const loadTrainSchedules = async () => {
    try {
      setLoading(true)
      const schedules = await fetchTrainSchedules()
      
      // Transform backend data to match component format
      const transformedTrips = schedules.map(schedule => {
        const totalCapacity = parseFloat(schedule.train_capacity)
        const availableCapacity = parseFloat(schedule.available_capacity)
        const usedCapacity = totalCapacity - availableCapacity
        const utilizationPercent = (usedCapacity / totalCapacity) * 100
        
        let status = 'Available'
        if (utilizationPercent >= 100) {
          status = 'Overbooked'
        } else if (utilizationPercent >= 90) {
          status = 'Warning'
        } else if (utilizationPercent === 100) {
          status = 'At Capacity'
        }
        
        return {
          id: schedule.trip_id,
          time: formatTime(schedule.start_time),
          date: formatDate(schedule.day_date),
          trainId: schedule.train_id,
          trainName: schedule.train_name,
          assigned: usedCapacity.toFixed(2),
          capacity: totalCapacity.toFixed(2),
          available: availableCapacity.toFixed(2),
          status,
          route: schedule.destination_city,
        }
      })
      
      setTrips(transformedTrips)
      
      // Generate alerts based on schedules
      const newAlerts = []
      transformedTrips.forEach(trip => {
        if (trip.status === 'Overbooked') {
          newAlerts.push({
            id: trip.id,
            title: `Conflict Detected: ${trip.trainId} Overbooked`,
            description: `${trip.trainName} is assigned ${trip.assigned} units but has a max capacity of ${trip.capacity} units. Immediate action required.`,
            tone: 'error',
          })
        } else if (trip.status === 'Warning') {
          newAlerts.push({
            id: trip.id,
            title: `Warning: ${trip.trainId} Near Capacity`,
            description: `${trip.trainName} is at ${((parseFloat(trip.assigned) / parseFloat(trip.capacity)) * 100).toFixed(0)}% capacity. Review before adding more orders.`,
            tone: 'warning',
          })
        }
      })
      
      setAlerts(newAlerts)
    } catch (error) {
      console.error('Error loading train schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const statusTone = {
    Available: 'success',
    Warning: 'warning',
    Overbooked: 'danger',
    'At Capacity': 'neutral',
  }

  if (loading) {
    return (
      <div className="train-schedule">
        <div className="loading-message">Loading train schedules...</div>
      </div>
    )
  }

  return (
    <div className="train-schedule">
      <ScheduleHeader onRefresh={loadTrainSchedules} />
      {alerts.length > 0 && <ScheduleAlerts alerts={alerts} />}
      <ScheduleTable trips={trips} statusTone={statusTone} />
    </div>
  )
}

export default TrainSchedule

