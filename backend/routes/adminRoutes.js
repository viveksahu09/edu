const express = require('express');
const router = express.Router();
const {
  getAdminInfo,
  transferAdminRole,
  checkAdminExists
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/check', checkAdminExists);

// Admin only routes
router.get('/info', authenticate, authorize('admin'), getAdminInfo);
router.post('/transfer', authenticate, authorize('admin'), transferAdminRole);

module.exports = router;
