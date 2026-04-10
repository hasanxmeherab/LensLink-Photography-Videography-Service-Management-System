const mongoose = require('mongoose');

const mediaItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true }, // Cloudinary public_id for deletion
  type: { type: String, enum: ['image', 'video'], default: 'image' },
});

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
    media: {
      type: [mediaItemSchema],
      default: [],
    },
    category: {
      type: String,
      enum: ['wedding', 'event', 'birthday', 'fashion', 'baby', 'portrait', 'commercial', 'other'],
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
