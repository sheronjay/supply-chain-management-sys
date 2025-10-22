import * as trainScheduleService from '../../services/trainSchedule.service.js';

export const getTrainSchedules = async (req, res) => {
  try {
    const schedules = await trainScheduleService.getTrainSchedules();
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching train schedules:', error);
    res.status(500).json({ message: 'Error fetching train schedules' });
  }
};

export const createTrainSchedule = async (req, res) => {
  try {
    const scheduleData = req.body;
    const result = await trainScheduleService.createTrainSchedule(scheduleData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating train schedule:', error);
    res.status(500).json({ message: error.message || 'Error creating train schedule' });
  }
};

export const getTrains = async (req, res) => {
  try {
    const trains = await trainScheduleService.getTrains();
    res.json(trains);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ message: 'Error fetching trains' });
  }
};

export const getStores = async (req, res) => {
  try {
    const stores = await trainScheduleService.getStores();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Error fetching stores' });
  }
};