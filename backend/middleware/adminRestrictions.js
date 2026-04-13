const User = require('../models/User');

// Middleware to ensure admin limit is respected
const adminLimitRestriction = async (req, res, next) => {
  try {
    // For operations that might affect the admin role
    const { role } = req.body;
    const MAX_ADMINS = 3;
    
    // If trying to set role to ADMIN or SUPER_ADMIN, check if admin limit is reached
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      const adminCount = await User.count({ where: { role: 'ADMIN' } });
      const superAdminCount = await User.count({ where: { role: 'SUPER_ADMIN' } });
      const totalAdmins = adminCount + superAdminCount;
      
      if (totalAdmins >= MAX_ADMINS) {
        return res.status(403).json({
          success: false,
          message: `Cannot create another admin. Maximum ${MAX_ADMINS} admins allowed (including super admin).`,
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
  adminLimitRestriction,
  preventSelfDeletion,
};
