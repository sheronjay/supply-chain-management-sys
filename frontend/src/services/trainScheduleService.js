import api from './api';

export const getTrainSchedules = async () => {
  const response = await api.get('/train-schedules');
  return response.data;
};

export const createTrainSchedule = async (scheduleData) => {
  const response = await api.post('/train-schedules', scheduleData);
  return response.data;
};

export const getTrains = async () => {
  const response = await api.get('/train-schedules/trains');
  return response.data;
};

export const getStores = async () => {
  const response = await api.get('/train-schedules/stores');
  return response.data;
};