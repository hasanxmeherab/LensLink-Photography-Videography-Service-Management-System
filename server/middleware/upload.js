const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Allowed file types
const ALLOWED_FORMATS = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  video: ['mp4', 'webm', 'mov', 'avi'],
};

/**
 * Creates a multer upload middleware that streams directly to Cloudinary.
 * @param {string} folder - Cloudinary folder name ('services' | 'portfolio')
 */
const createUpload = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isVideo = file.mimetype.startsWith('video/');
      return {
        folder: `lenslink/${folder}`,
        resource_type: isVideo ? 'video' : 'image',
        allowed_formats: [...ALLOWED_FORMATS.image, ...ALLOWED_FORMATS.video],
        transformation: isVideo
          ? [] // no transform for videos
          : [{ quality: 'auto', fetch_format: 'auto' }], // auto-optimize images
      };
    },
  });

  return multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB per file
    fileFilter: (req, file, cb) => {
      const allowed = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm', 'video/quicktime', 'video/avi',
      ];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
      }
    },
  });
};

module.exports = { createUpload };
