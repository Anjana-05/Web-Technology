const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  name: String,
  email: String,
  contactNumber: String,
  purpose: String,
  checkInTime: Date,
  checkOutTime: Date,
  status: String
});

module.exports = mongoose.model('Visitor', VisitorSchema);
