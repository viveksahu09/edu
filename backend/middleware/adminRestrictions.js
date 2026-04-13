const User = require('../models/User');

// Middleware to ensure single admin operations are safe
const singleAdminRestriction = async (req, res, next) => {
  try {
    // For operations that might affect the admin role
    const { role } = req.body;
    
    // If trying to set role to admin, check if admin already exists
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ where: { role: 'admin' } });
      if (existingAdmin && existingAdmin.id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Cannot create another admin. Only one admin is allowed.',
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Admin restriction middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin validation',
      error: error.message,
    });
  }
};

// Middleware to prevent admin from deleting themselves
const preventSelfDeletion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;
    
    // Prevent admin from deleting their own account
    if (id === currentUserId && req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin cannot delete their own account. Transfer admin role first.',
      });
    }
    
    next();
  } catch (error) {
    console.error('Prevent self deletion middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion validation',
      error: error.message,
    });
  }
};

module.exports = {
  singleAdminRestriction,
  preventSelfDeletion,
};
