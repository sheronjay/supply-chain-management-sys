import api from './api';

export const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const createUser = async (user) => {
  const res = await api.post('/users', user);
  return res.data;
};

export const updateUser = async (userId, updates) => {
  const res = await api.put(`/users/${userId}`, updates);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};

export const toggleEmployment = async (userId, isEmployed) => {
  const res = await api.put(`/users/${userId}/toggle`, { is_employed: isEmployed });
  return res.data;
};


