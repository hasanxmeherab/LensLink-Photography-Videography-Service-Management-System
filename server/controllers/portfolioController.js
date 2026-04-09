const Portfolio = require('../models/Portfolio');

// @route   GET /api/portfolio
// @desc    Get all portfolio items
// @access  Public
exports.getAllPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: portfolio.length,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/portfolio/featured
// @desc    Get featured portfolio items
// @access  Public
exports.getFeaturedPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.find({ featured: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: portfolio.length,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/portfolio/:id
// @desc    Get single portfolio item
// @access  Public
exports.getPortfolioItem = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }
    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/portfolio
// @desc    Create portfolio item (Admin only)
// @access  Private
exports.createPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, mediaURL, mediaType, category, featured } = req.body;

    const portfolio = await Portfolio.create({
      title,
      description,
      mediaURL,
      mediaType,
      category,
      featured,
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully',
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/portfolio/:id
// @desc    Update portfolio item (Admin only)
// @access  Private
exports.updatePortfolioItem = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/portfolio/:id
// @desc    Delete portfolio item (Admin only)
// @access  Private
exports.deletePortfolioItem = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
