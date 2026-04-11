const express = require('express');
const router = express.Router();
const {
  submitContribution,
  getAllContributions,
  approveContribution,
  rejectContribution,
  getResearchTopics,
  getUserContributions
} = require('../controllers/contributionController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/research-topics', getResearchTopics);

// Protected routes (require authentication)
router.post('/submit', authenticate, submitContribution);
router.get('/my-contributions', authenticate, getUserContributions);

// Admin routes
router.get('/all', authenticate, authorize('admin'), getAllContributions);
router.put('/:id/approve', authenticate, authorize('admin'), approveContribution);
router.put('/:id/reject', authenticate, authorize('admin'), rejectContribution);

module.exports = router;
