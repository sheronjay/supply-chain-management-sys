/**
 * Authentication Middleware
 * Validates user authentication and extracts user info from localStorage simulation
 * In a production environment, this would validate JWT tokens
 */

export function authenticateUser(req, res, next) {
  try {
    // Get user data from request headers
    const userDataHeader = req.headers['x-user-data'];
    
    if (!userDataHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Parse user data
    const userData = JSON.parse(userDataHeader);
    
    if (!userData || !userData.user_id) {
      return res.status(401).json({ error: 'Invalid user data' });
    }

    // Attach user data to request object
    req.user = userData;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid authentication data' });
  }
}

/**
 * Authorization Middleware - Store Manager only
 */
export function authorizeStoreManager(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user is a store manager (has store_id and appropriate designation)
  if (!req.user.store_id) {
    return res.status(403).json({ error: 'Access denied. Store managers only.' });
  }

  next();
}

/**
 * Optional authentication - doesn't fail if no auth provided
 * Useful for endpoints that work for both authenticated and public access
 */
export function optionalAuth(req, res, next) {
  try {
    const userDataHeader = req.headers['x-user-data'];
    
    if (userDataHeader) {
      const userData = JSON.parse(userDataHeader);
      req.user = userData;
    }
    
    next();
  } catch (error) {
    // If there's an error parsing, just continue without user
    next();
  }
}
