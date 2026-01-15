const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // --- COMMON FIELDS ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'volunteer', 'admin'], default: 'user' },
  
  // ✅ ADDED: Gender
  gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Other'], 
      default: 'Male' 
  },

  // --- USER SPECIFIC ---
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

  // --- VOLUNTEER SPECIFIC ---
  phoneVerified: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, default: false },
  
  // Documents
  selfieImage: { type: String }, 
  govtId: { type: String },      
  drivingLicense: { type: String }, 
  medicalCertificate: { type: String }, // ✅ ADDED: Medical Cert
  
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

  // --- ADMIN / VERIFICATION ---
  isVerified: { type: Boolean, default: false }, 
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  interviewStatus: {
      type: String,
      enum: ['pending', 'completed'], 
      default: 'pending'
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);