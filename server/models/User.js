const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'volunteer', 'admin'], default: 'user' },
  
  // --- USER SPECIFIC SAFETY & ACCESS ---
  emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String }
  },
  medicalCondition: { type: String },
  preferences: {
      largeText: { type: Boolean, default: false },
      wheelchair: { type: Boolean, default: false }
  },

  // --- VOLUNTEER SPECIFIC FIELDS ---
  phoneVerified: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, default: false },
  selfieImage: { type: String },
  serviceSector: { type: String, default: 'general' },
  govtId: { type: String }, 
  drivingLicense: { type: String }, 
  vehicleDetails: { type: Object },

  isVerified: { type: Boolean, default: false }, 
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);