const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, password, role: 'admin' });
    if (!admin) return res.status(401).json({ error: 'Invalid admin credentials' });
    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 