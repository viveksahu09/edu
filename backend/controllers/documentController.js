const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, documents, and PDFs are allowed'));
    }
  }
});

// Upload documents
const uploadDocuments = async (req, res) => {
  try {
    // Apply multer middleware
    upload.array('files', 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      // Mock database save for testing
      const uploadedDocuments = req.files.map(file => ({
        id: 'mock-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        name: file.originalname,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString().split('T')[0],
        filePath: file.path,
      }));

      res.status(201).json({
        message: 'Documents uploaded successfully',
        documents: uploadedDocuments,
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload documents', error: error.message });
  }
};

// Get all documents for a user
const getDocuments = async (req, res) => {
  try {
    // Mock documents for testing
    const mockDocuments = [
      {
        id: 'mock-1',
        name: 'Sample Document.pdf',
        size: '2.5 MB',
        uploadedAt: '2024-03-15',
        filePath: '/uploads/documents/sample.pdf',
      },
      {
        id: 'mock-2', 
        name: 'Test File.docx',
        size: '1.8 MB',
        uploadedAt: '2024-03-14',
        filePath: '/uploads/documents/test.docx',
      }
    ];

    res.json(mockDocuments);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
  }
};

// Download a document
const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Mock download - in real implementation, fetch from database
    res.status(404).json({ message: 'Document not found' });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download document', error: error.message });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Mock delete - in real implementation, delete from database and filesystem
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  uploadDocuments,
  getDocuments,
  downloadDocument,
  deleteDocument,
};
