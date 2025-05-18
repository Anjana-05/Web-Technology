const mongoose = require('mongoose');

const gateEntrySchema = new mongoose.Schema({
  visitor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Visitor', 
    required: true 
  },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  comments: { type: String }
}, { timestamps: true });

// Add index for better query performance
gateEntrySchema.index({ visitor: 1 });
gateEntrySchema.index({ checkInTime: -1 });

module.exports = mongoose.model('GateEntry', gateEntrySchema);