const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, user: req.user.userId });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get my bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking (user)
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete booking (user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update status
router.patch('/status/:id', async (req, res) => {
  try {
    const update = { status: req.body.status };
    if (req.body.status === 'cancelled' && req.body.cancelReason) {
      update.cancelReason = req.body.cancelReason;
    } else if (req.body.status !== 'cancelled') {
      update.cancelReason = undefined;
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 