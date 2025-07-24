const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, email } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required.' });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this phone number.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ phone, password: hashedPassword, name, email });
    await user.save();
    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
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
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.status(200).json({ message: 'Login successful.', user: { phone: user.phone, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
