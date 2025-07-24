const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login route
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Admin user does not exist.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Optionally, check for admin role here if you add roles later
    res.status(200).json({ message: 'Admin login successful.', user: { email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});


// Register route
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, email } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required.' });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ phone, password: hashedPassword, name, email });
    await user.save();
    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    // Duplicate key error (phone already exists)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.phone) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    // Validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required.' });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    res.status(200).json({
      message: 'Login successful.',
      user: { phone: user.phone, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
