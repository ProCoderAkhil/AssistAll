import mongoose from 'mongoose';

const AccessCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  generatedBy: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

const AccessCode = mongoose.model('AccessCode', AccessCodeSchema);
export default AccessCode;