import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'volunteer', 'admin'], default: 'user' },
  
  // Verification
  govtId: { type: String, default: '' }, 
  isVerified: { type: Boolean, default: false },

  // NEW: User Saved Locations
  favorites: [{
    name: { type: String, required: true }, // e.g., 'Home', 'Work'
    address: { type: String, required: true }
  }],
  
  needs: {
    wheelchair: { type: Boolean, default: false },
    visual: { type: Boolean, default: false },
    hearing: { type: Boolean, default: false },
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);