const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'unique_record_jwt_secret_key_2026_super_secure';

/**
 * Middleware to protect routes that require user or admin authentication
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or forged authentication token.',
      code: 'TOKEN_INVALID',
    });
  }
};

/**
 * Middleware strictly restricted to Administrators
 */
const adminOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Administrator authentication required. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Administrator authentication required. Please log in.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify role is admin
    if (decoded.role !== 'admin') {
      // Cross-check if user ID exists in Admin collection
      const adminExists = await Admin.findById(decoded.id || decoded._id);
      if (!adminExists) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Administrator privileges required.',
        });
      }
    }

    req.user = decoded;
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Admin session expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or forged administrator token.',
      code: 'TOKEN_INVALID',
    });
  }
};

/**
 * Middleware that extracts user info if present, but doesn't block unauthenticated requests
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      }
    }
  } catch (e) {
    // Ignore invalid/expired tokens for optional routes
    req.user = null;
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth,
};
