const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

// Build media array from Cloudinary-uploaded files (multer-storage-cloudinary adds .path and .filename)
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

// @route   GET /api/services
// @desc    Get all services
// @access  Public
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/services
// @desc    Create a new service (Admin only)
// @access  Private
exports.createService = async (req, res, next) => {
  try {
    const { title, description, price, category, duration } = req.body;
    const newMedia = buildMediaFromFiles(req.files);

    const service = await Service.create({
      title,
      description,
      price,
      category,
      duration,
      media: newMedia,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    // Roll back Cloudinary uploads if DB save fails
    await deleteCloudinaryAssets(buildMediaFromFiles(req.files));
    next(error);
  }
};

// @route   PUT /api/services/:id
// @desc    Update service (Admin only)
// @access  Private
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const { title, description, price, category, duration, existingMedia } = req.body;

    // existingMedia = JSON string of media items the admin chose to KEEP
    let keptMedia = [];
    if (existingMedia) {
      try { keptMedia = JSON.parse(existingMedia); } catch (_) {}
    }

    // Delete removed media from Cloudinary
    const keptIds = new Set(keptMedia.map((m) => m.publicId));
    const removedMedia = service.media.filter((m) => !keptIds.has(m.publicId));
    await deleteCloudinaryAssets(removedMedia);

    // Append newly uploaded files
    const newMedia = buildMediaFromFiles(req.files);
    const combinedMedia = [...keptMedia, ...newMedia];

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, duration, media: combinedMedia },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    await deleteCloudinaryAssets(buildMediaFromFiles(req.files));
    next(error);
  }
};

// @route   DELETE /api/services/:id
// @desc    Delete service (Admin only)
// @access  Private
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Delete all associated media from Cloudinary
    await deleteCloudinaryAssets(service.media);

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
