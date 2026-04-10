const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message: messages,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // File size too large error
  if (err.message && err.message.includes('File size too large')) {
    const match = err.message.match(/Got (\d+)\. Maximum is (\d+)/);
    if (match) {
      const gotMB = (parseInt(match[1]) / 1048576).toFixed(2);
      const maxMB = (parseInt(match[2]) / 1048576).toFixed(2);
      return res.status(413).json({
        success: false,
        message: `File size too large. Got ${gotMB} MB. Maximum is ${maxMB} MB.`,
      });
    }
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
