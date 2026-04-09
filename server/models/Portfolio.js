const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    mediaURL: {
      type: String,
      required: [true, 'Please provide a media URL'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    category: {
      type: String,
      enum: ['wedding', 'event', 'portrait', 'commercial', 'other'],
      default: 'other',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
