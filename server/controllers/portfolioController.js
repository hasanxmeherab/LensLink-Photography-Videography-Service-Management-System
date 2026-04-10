const Portfolio = require('../models/Portfolio');
const cloudinary = require('../config/cloudinary');

// Build media array from Cloudinary-uploaded files
const buildMediaFromFiles = (files) =>
  (files || []).map((file) => ({
    url: file.path,                  // Cloudinary secure_url
    publicId: file.filename,         // Cloudinary public_id
    type: file.mimetype.startsWith('video/') ? 'video' : 'image',
  }));

// Delete a list of Cloudinary assets
const deleteCloudinaryAssets = async (mediaItems) => {
  for (const item of mediaItems) {
    try {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === 'video' ? 'video' : 'image',
      });
    } catch (err) {
      console.error(`Cloudinary delete error [${item.publicId}]:`, err.message);
    }
  }
};

// @route   GET /api/portfolio
// @desc    Get all portfolio items
// @access  Public
exports.getAllPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: portfolio.length, data: portfolio });
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
    res.status(200).json({ success: true, count: portfolio.length, data: portfolio });
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
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/portfolio
// @desc    Create portfolio item (Admin only)
// @access  Private
exports.createPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, category, featured } = req.body;
    const newMedia = buildMediaFromFiles(req.files);

    const portfolio = await Portfolio.create({
      title,
      description,
      category,
      featured: featured === 'true' || featured === true,
      media: newMedia,
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully',
      data: portfolio,
    });
  } catch (error) {
    await deleteCloudinaryAssets(buildMediaFromFiles(req.files));
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
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    const { title, description, category, featured, existingMedia } = req.body;

    // existingMedia = JSON string of media items the admin chose to KEEP
    let keptMedia = [];
    if (existingMedia) {
      try { keptMedia = JSON.parse(existingMedia); } catch (_) {}
    }

    // Delete removed media from Cloudinary
    const keptIds = new Set(keptMedia.map((m) => m.publicId));
    const removedMedia = portfolio.media.filter((m) => !keptIds.has(m.publicId));
    await deleteCloudinaryAssets(removedMedia);

    // Append newly uploaded files
    const newMedia = buildMediaFromFiles(req.files);
    const combinedMedia = [...keptMedia, ...newMedia];

    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        featured: featured === 'true' || featured === true,
        media: combinedMedia,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: portfolio,
    });
  } catch (error) {
    await deleteCloudinaryAssets(buildMediaFromFiles(req.files));
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
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    // Delete all associated media from Cloudinary
    await deleteCloudinaryAssets(portfolio.media);

    await Portfolio.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
