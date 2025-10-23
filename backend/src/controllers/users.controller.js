import * as usersService from '../../services/users.service.js';

export const listUsers = async (_req, res) => {
  try {
    const users = await usersService.listUsers();
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Error listing users' });
  }
};

export const createUser = async (req, res) => {
  try {
    const required = ['user_id', 'name', 'password', 'designation'];
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    const result = await usersService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message || 'Error creating user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersService.updateUser(id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersService.deleteUser(id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const toggleEmployment = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_employed } = req.body;
    const result = await usersService.toggleEmployment(id, is_employed);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Toggled' });
  } catch (error) {
    console.error('Error toggling user employment:', error);
    res.status(500).json({ message: 'Error toggling user employment' });
  }
};


