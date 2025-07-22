require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://online-laundry-service.vercel.app',
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/auth', require('./routes/auth'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 