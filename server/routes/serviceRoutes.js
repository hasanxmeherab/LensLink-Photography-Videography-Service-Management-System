const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const { createUpload } = require('../middleware/upload');

const upload = createUpload('services');

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Protected routes — multipart/form-data with up to 10 media files
router.post('/', protect, adminOnly, upload.array('media', 10), createService);
router.put('/:id', protect, adminOnly, upload.array('media', 10), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
