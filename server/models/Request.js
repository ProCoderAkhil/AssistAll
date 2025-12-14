const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  requesterId: { type: String, required: true },
  type: { type: String, required: true },
  
  // Locations
  pickupLocation: { type: String, default: "Current Location" },
  dropOffLocation: { type: String, required: true },
  scheduledTime: { type: String, default: "Now" }, 
  
  // Money & Payment
  price: { type: Number, default: 0 },
  distance: { type: String, default: "0 km" },
  eta: { type: String, default: '5 mins' },
  tip: { type: Number, default: 0 },
  
  // NEW: Track Payment Method
  paymentMethod: { type: String, enum: ['online', 'cash', 'pending'], default: 'pending' },
  payoutStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },

  // Statuses
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed'], default: 'pending' },

  location: { type: Object, required: true }, 
  volunteerName: { type: String, default: null },
  volunteerId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);