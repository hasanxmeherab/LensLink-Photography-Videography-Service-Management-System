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
const { validatePortfolio } = require('../middleware/validators');

// Public routes
router.get('/', getAllPortfolio);
router.get('/featured', getFeaturedPortfolio);
router.get('/:id', getPortfolioItem);

// Protected routes
router.post('/', protect, adminOnly, validatePortfolio, createPortfolioItem);
router.put('/:id', protect, adminOnly, validatePortfolio, updatePortfolioItem);
router.delete('/:id', protect, adminOnly, deletePortfolioItem);

module.exports = router;
