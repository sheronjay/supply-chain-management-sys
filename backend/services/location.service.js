import pool from '../src/db/pool.js';

/**
 * Get all stores
 */
async function getAllStores() {
  const [stores] = await pool.query(
    'SELECT store_id, city FROM stores ORDER BY city'
  );
  return stores;
}

/**
 * Get store by city
 */
async function getStoreByCity(city) {
  const [stores] = await pool.query(
    'SELECT store_id, city FROM stores WHERE city = ?',
    [city]
  );
  return stores.length > 0 ? stores[0] : null;
}

/**
 * Get sub-cities by store ID
 */
async function getSubCitiesByStore(storeId) {
  const [subCities] = await pool.query(
    'SELECT sub_city_id, sub_city_name, store_id FROM sub_cities WHERE store_id = ? ORDER BY sub_city_name',
    [storeId]
  );
  return subCities;
}

/**
 * Get all sub-cities
 */
async function getAllSubCities() {
  const [subCities] = await pool.query(
    'SELECT sub_city_id, sub_city_name, store_id FROM sub_cities ORDER BY store_id, sub_city_name'
  );
  return subCities;
}

export {
  getAllStores,
  getStoreByCity,
  getSubCitiesByStore,
  getAllSubCities
};
