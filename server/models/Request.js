import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    requesterName: { type: String, required: true },
    type: { type: String, default: 'Ride' },
    price: { type: Number, default: 0 },
    pickup: { type: String, default: '' },
    drop: { type: String, default: '' },
    volunteerName: { type: String, default: '' },
    volunteerId: { type: String, default: '' },
    // Ensure 'in_progress' is allowed here, or remove 'enum' entirely
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'in_progress', 'completed'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', RequestSchema);
export default Request;