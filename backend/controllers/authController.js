const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, role, institution } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Check if trying to register as admin and enforce single admin rule
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ where: { role: 'admin' } });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin account already exists. Only one admin is allowed.',
        });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      institution: institution || '',
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      preferences: user.preferences,
      progress: user.progress,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response and normalize role
    const normalizedRole = () => {
      switch(user.role) {
        case 'admin':
        case 'ADMIN':
          return 'ADMIN';
        case 'super_admin':
        case 'SUPER_ADMIN':
          return 'SUPER_ADMIN';
        case 'student':
        case 'STUDENT':
          return 'student';
        case 'teacher':
        case 'TEACHER':
          return 'teacher';
        case 'researcher':
        case 'RESEARCHER':
          return 'researcher';
        default:
          return user.role || 'student';
      }
    };

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizedRole(),
      institution: user.institution,
      preferences: user.preferences,
      progress: user.progress,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Normalize role for frontend compatibility
    const normalizedRole = () => {
      switch(user.role) {
        case 'admin':
        case 'ADMIN':
          return 'ADMIN';
        case 'super_admin':
        case 'SUPER_ADMIN':
          return 'SUPER_ADMIN';
        case 'student':
        case 'STUDENT':
          return 'student';
        case 'teacher':
        case 'TEACHER':
          return 'teacher';
        case 'researcher':
        case 'RESEARCHER':
          return 'researcher';
        default:
          return user.role || 'student';
      }
    };

    const normalizedUser = {
      ...user.toJSON(),
      role: normalizedRole(),
    };

    res.status(200).json({
      success: true,
      data: {
        user: normalizedUser,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
