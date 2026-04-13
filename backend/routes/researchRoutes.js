const express = require('express');
const router = express.Router();
const { getApprovedTopics, getAllTopics, createResearchTopic, deleteResearchTopic } = require('../controllers/researchController');
// const auth = require('../middleware/auth');

// Get approved research topics (public endpoint)
router.get('/topics', getApprovedTopics);

// Get all research topics (admin only)
router.get('/topics/all', getAllTopics);

// Create research topic from approved contribution (admin only)
router.post('/topics', createResearchTopic);

// Delete research topic (admin only)
router.delete('/topics/:id', deleteResearchTopic);

module.exports = router;
