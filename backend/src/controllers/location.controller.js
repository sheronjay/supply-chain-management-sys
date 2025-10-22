import * as locationService from '../../services/location.service.js';

/**
 * Get all stores
 */
async function getAllStores(req, res, next) {
  try {
    const stores = await locationService.getAllStores();
    res.json(stores);
  } catch (error) {
    next(error);
  }
}

/**
 * Get store by city
 */
async function getStoreByCity(req, res, next) {
  try {
    const { city } = req.params;
    const store = await locationService.getStoreByCity(city);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found for this city' });
    }
    
    res.json(store);
  } catch (error) {
    next(error);
  }
}

/**
 * Get sub-cities by store ID
 */
async function getSubCitiesByStore(req, res, next) {
  try {
    const { storeId } = req.params;
    const subCities = await locationService.getSubCitiesByStore(storeId);
    res.json(subCities);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all sub-cities
 */
async function getAllSubCities(req, res, next) {
  try {
    const subCities = await locationService.getAllSubCities();
    res.json(subCities);
  } catch (error) {
    next(error);
  }
}

export {
  getAllStores,
  getStoreByCity,
  getSubCitiesByStore,
  getAllSubCities
};
