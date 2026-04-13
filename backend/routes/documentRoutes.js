const express = require('express');
const router = express.Router();
const { uploadDocuments, getDocuments, downloadDocument, deleteDocument } = require('../controllers/documentController');
// const auth = require('../middleware/auth');

// Upload documents (multiple files) - auth temporarily removed for testing
router.post('/upload', uploadDocuments);

// Get all documents for the authenticated user - auth temporarily removed for testing
router.get('/', getDocuments);

// Download a specific document - auth temporarily removed for testing
router.get('/:id/download', downloadDocument);

// Delete a specific document - auth temporarily removed for testing
router.delete('/:id', deleteDocument);

module.exports = router;
