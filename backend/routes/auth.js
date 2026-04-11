const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user profile (protected)
router.get('/profile', authenticate, getProfile);

module.exports = router;
