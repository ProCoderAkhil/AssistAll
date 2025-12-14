const mongoose = require('mongoose');

const AccessCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  generatedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('AccessCode', AccessCodeSchema);