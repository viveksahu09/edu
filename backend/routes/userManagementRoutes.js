const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  resetUserPassword
} = require('../controllers/userManagementController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Get all users (for user management table)
router.get('/', getAllUsers);

// Get single user by ID
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Reset user password
router.put('/:id/reset-password', resetUserPassword);

module.exports = router;
