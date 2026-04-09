const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('serviceId', 'title price');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/bookings/user/:userId
// @desc    Get user's bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('serviceId', 'title price category');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'title price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Public
exports.createBooking = async (req, res, next) => {
  try {
    const { userId, serviceId, bookingDate, clientName, clientEmail, clientPhone, message } = req.body;

    // Get service to calculate total price
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    const booking = await Booking.create({
      userId,
      serviceId,
      bookingDate,
      clientName,
      clientEmail,
      clientPhone,
      message,
      totalPrice: service.price,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/bookings/:id
// @desc    Update booking status (Admin only)
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/bookings/:id
// @desc    Delete booking (Admin only)
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
