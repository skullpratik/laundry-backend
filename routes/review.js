const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new review
router.post('/', async (req, res) => {
  try {
    const { name, email, text } = req.body;
    if (!name || !email || !text) {
      return res.status(400).json({ message: 'Name, email, and text are required.' });
    }
    const review = new Review({ name, email, text });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
