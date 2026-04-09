const Service = require('../models/Service');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
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
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/services
// @desc    Create a new service (Admin only)
// @access  Private
exports.createService = async (req, res, next) => {
  try {
    const { title, description, price, category, duration, image } = req.body;

    const service = await Service.create({
      title,
      description,
      price,
      category,
      duration,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
