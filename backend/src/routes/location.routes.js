import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Get store by city
router.get('/stores/city/:city', async (req, res, next) => {
  try {
    const { city } = req.params;
    const [stores] = await pool.query(
      'SELECT store_id, city FROM stores WHERE city = ?',
      [city]
    );
    
    if (stores.length === 0) {
      return res.status(404).json({ error: 'Store not found for this city' });
    }
    
    res.json(stores[0]);
  } catch (error) {
    next(error);
  }
});

// Get sub-cities by store ID
router.get('/sub-cities/store/:storeId', async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const [subCities] = await pool.query(
      'SELECT sub_city_id, sub_city_name, store_id FROM sub_cities WHERE store_id = ? ORDER BY sub_city_name',
      [storeId]
    );
    
    res.json(subCities);
  } catch (error) {
    next(error);
  }
});

export default router;
