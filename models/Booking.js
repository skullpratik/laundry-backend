const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  clothCount: { type: Number, required: true },
  serviceType: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'processed', 'on the way', 'delivered'], default: 'pending' },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Booking', bookingSchema); 