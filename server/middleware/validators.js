const { body, validationResult } = require('express-validator');

// Validation middleware wrapper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Service validation rules
const validateService = [
  body('title').trim().notEmpty().withMessage('Service title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(['photography', 'videography', 'editing', 'package'])
    .withMessage('Invalid category'),
  validate,
];

// Booking validation rules
const validateBooking = [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('clientEmail').isEmail().withMessage('Valid email is required'),
  body('clientPhone').notEmpty().withMessage('Client phone is required'),
  validate,
];

// Portfolio validation rules
const validatePortfolio = [
  body('title').trim().notEmpty().withMessage('Portfolio title is required'),
  body('mediaURL').isURL().withMessage('Valid URL is required'),
  body('mediaType')
    .isIn(['image', 'video'])
    .withMessage('Media type must be image or video'),
  validate,
];

module.exports = {
  validateUserSignup,
  validateUserLogin,
  validateService,
  validateBooking,
  validatePortfolio,
};
