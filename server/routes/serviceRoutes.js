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
const { validateService } = require('../middleware/validators');

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Protected routes
router.post('/', protect, adminOnly, validateService, createService);
router.put('/:id', protect, adminOnly, validateService, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
