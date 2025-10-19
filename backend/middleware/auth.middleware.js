import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Authenticate user using JWT
 */
export function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization']; // Expect: "Bearer <token>"
  if (!authHeader) return res.status(401).json({ error: 'Authentication required' });

  const token = authHeader.split(' ')[1]; // Extract the token
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function authorizeStoreManager(req, res, next) {
  if (!req.user || !req.user.userType) {
    return res.status(403).json({ error: 'Access denied. Store managers only.' });
  }
  
  // Allow both Store Managers (with store_id) and Main Store Managers (without store_id)
  const isStoreManager = req.user.store_id && req.user.designation === 'Store Manager';
  const isMainStoreManager = req.user.designation === 'Main Store Manager';
  
  if (!isStoreManager && !isMainStoreManager) {
    return res.status(403).json({ error: 'Access denied. Store managers only.' });
  }
  
  next();
}

export function authorizeMainStoreManager(req, res, next) {
  if (!req.user || !req.user.userType) {
    return res.status(403).json({ error: 'Access denied. Main store managers only.' });
  }
  
  // Only allow Main Store Managers
  if (req.user.designation !== 'Main Store Manager') {
    return res.status(403).json({ error: 'Access denied. Main store managers only.' });
  }
  
  next();
}
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next(); // continue without auth

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // ignore errors and continue
  }
  next();
}




