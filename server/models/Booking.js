const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Please provide a service ID'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please provide a booking date'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'rejected'],
      default: 'pending',
    },
    clientName: {
      type: String,
      required: [true, 'Please provide client name'],
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide client email'],
    },
    clientPhone: {
      type: String,
      required: [true, 'Please provide client phone'],
    },
    message: {
      type: String,
      default: '',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
