const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // --- COMMON FIELDS ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'volunteer', 'admin'], default: 'user' },
  
  // --- USER (PASSENGER) SPECIFIC FIELDS ---
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
  // Security & Legal
  phoneVerified: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, default: false },
  
  // Documents & Verification
  selfieImage: { type: String }, // Stores Base64 string
  govtId: { type: String },      
  drivingLicense: { type: String }, 
  serviceSector: { 
      type: String, 
      enum: ['transport', 'medical', 'companionship', 'general'],
      default: 'general' 
  },
  vehicleDetails: {
      type: { type: String },
      model: { type: String },
      number: { type: String }
  },

  // --- ADMIN / VERIFICATION STATUS ---
  isVerified: { type: Boolean, default: false }, // Final Lock
  
  // Verification Stages
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Interview Logic
  interviewStatus: {
      type: String,
      enum: ['pending', 'completed'], // 'completed' means code was entered correctly
      default: 'pending'
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);