const User = require('../models/User');

// Get current admin info
const getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'No admin account found',
      });
    }

    const adminResponse = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      institution: admin.institution,
      createdAt: admin.createdAt,
    };

    res.status(200).json({
      success: true,
      data: {
        admin: adminResponse,
      },
    });
  } catch (error) {
    console.error('Get admin info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin info',
      error: error.message,
    });
  }
};

// Transfer admin role to another user (only current admin can do this)
const transferAdminRole = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentAdminId = req.user.id;

    // Verify current user is admin
    const currentAdmin = await User.findByPk(currentAdminId);
    if (!currentAdmin || currentAdmin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only current admin can transfer admin role',
      });
    }

    // Find target user
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found',
      });
    }

    // Change target user to admin
    await targetUser.update({ role: 'admin' });
    
    // Change current admin to student
    await currentAdmin.update({ role: 'student' });

    res.status(200).json({
      success: false,
      message: 'Admin role transferred successfully',
      data: {
        newAdmin: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
        },
        previousAdmin: {
          id: currentAdmin.id,
          name: currentAdmin.name,
          email: currentAdmin.email,
          role: currentAdmin.role,
        },
      },
    });
  } catch (error) {
    console.error('Transfer admin role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer admin role',
      error: error.message,
    });
  }
};

// Check if admin exists
const checkAdminExists = async (req, res) => {
  try {
    const adminCount = await User.count({ where: { role: 'admin' } });
    
    res.status(200).json({
      success: true,
      data: {
        adminExists: adminCount > 0,
        adminCount: adminCount,
      },
    });
  } catch (error) {
    console.error('Check admin exists error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check admin existence',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminInfo,
  transferAdminRole,
  checkAdminExists,
};
