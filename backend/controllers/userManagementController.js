const User = require('../models/User');
const { singleAdminRestriction, preventSelfDeletion } = require('../middleware/adminRestrictions');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { email: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        users: users.rows,
        total: users.count,
        page: parseInt(page),
        totalPages: Math.ceil(users.count / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, institution, preferences } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if trying to change role to admin and enforce single admin rule
    if (role === 'admin' && user.role !== 'admin') {
      const existingAdmin = await User.findOne({ 
        where: { role: 'admin', id: { [require('sequelize').Op.ne]: id } }
      });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin account already exists. Only one admin is allowed.'
        });
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      institution: institution || user.institution,
      preferences: preferences || user.preferences
    };

    await user.update(updateData);

    // Return updated user without password
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // Prevent admin from deleting themselves
    if (id === currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Admin cannot delete their own account. Transfer admin role first.'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of the only admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin account. Transfer admin role first.'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, institution } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if trying to create admin and enforce single admin rule
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ where: { role: 'admin' } });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin account already exists. Only one admin is allowed.'
        });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      institution: institution || ''
    });

    // Return user without password
    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Reset user password (admin only)
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await user.update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  resetUserPassword
};
