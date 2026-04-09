const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getUserBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validators');

// Public routes
router.post('/', validateBooking, createBooking);

// Protected routes
router.get('/', protect, adminOnly, getAllBookings);
router.get('/user/:userId', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, adminOnly, updateBooking);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
