import ScheduleHeader from '../../components/trainSchedule/ScheduleHeader/ScheduleHeader'
import ScheduleAlerts from '../../components/trainSchedule/ScheduleAlerts/ScheduleAlerts'
import ScheduleTable from '../../components/trainSchedule/ScheduleTable/ScheduleTable'
import './TrainSchedule.css'

const alerts = [
  {
    id: 'TR102',
    title: 'Conflict Detected: TR-102 Overbooked',
    description: 'Train TR-5678 is assigned 13 units but has a max capacity of 12 units. Review ASAP.',
    tone: 'warning',
  },
  {
    id: 'TR702',
    title: 'Conflict Detected: TR-702 Overbooked',
    description: 'Train TR-702 is assigned 210 units but has a max capacity of 200 units. Immediate action required.',
    tone: 'error',
  },
]

const trips = [
  {
    time: '08:00 AM',
    id: 'T-001',
    assigned: 120,
    capacity: 150,
    status: 'Available',
    lead: 'Alice Johnson',
    route: 'Colombo to Jaffna',
  },
  {
    time: '10:30 AM',
    id: 'T-002',
    assigned: 90,
    capacity: 120,
    status: 'Available',
    lead: 'Bob Williams',
    route: 'Colombo to Kandy',
  },
  {
    time: '01:15 PM',
    id: 'T-004',
    assigned: 138,
    capacity: 140,
    status: 'Warning',
    lead: 'Charlie Brown',
    route: 'Colombo to Galle',
  },
  {
    time: '03:20 PM',
    id: 'T-006',
    assigned: 160,
    capacity: 150,
    status: 'Overbooked',
    lead: 'Diana Prince',
    route: 'Colombo to Batticaloa',
  },
  {
    time: '05:30 PM',
    id: 'T-008',
    assigned: 200,
    capacity: 200,
    status: 'At Capacity',
    lead: 'Ethan Hunt',
    route: 'Colombo to Trincomalee',
  },
  {
    time: '07:15 PM',
    id: 'T-009',
    assigned: 80,
    capacity: 130,
    status: 'Available',
    lead: 'Grace Hopper',
    route: 'Colombo to Matara',
  },
]

const statusTone = {
  Available: 'success',
  Warning: 'warning',
  Overbooked: 'danger',
  'At Capacity': 'neutral',
}

const TrainSchedule = () => (
  <div className="train-schedule">
    <ScheduleHeader />
    <ScheduleAlerts alerts={alerts} />
    <ScheduleTable trips={trips} statusTone={statusTone} />
  </div>
)

export default TrainSchedule
