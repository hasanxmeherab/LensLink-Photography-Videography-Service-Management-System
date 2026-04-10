const express = require('express');
const router = express.Router();
const {
  getAllPortfolio,
  getFeaturedPortfolio,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} = require('../controllers/portfolioController');
const { protect, adminOnly } = require('../middleware/auth');
const { createUpload } = require('../middleware/upload');

const upload = createUpload('portfolio');

// Public routes
router.get('/', getAllPortfolio);
router.get('/featured', getFeaturedPortfolio);
router.get('/:id', getPortfolioItem);

// Protected routes — multipart/form-data with up to 10 media files
router.post('/', protect, adminOnly, upload.array('media', 10), createPortfolioItem);
router.put('/:id', protect, adminOnly, upload.array('media', 10), updatePortfolioItem);
router.delete('/:id', protect, adminOnly, deletePortfolioItem);

module.exports = router;
