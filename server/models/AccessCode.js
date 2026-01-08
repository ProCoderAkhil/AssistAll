import mongoose from 'mongoose';

const AccessCodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '24h' }
});

export default mongoose.model('AccessCode', AccessCodeSchema);