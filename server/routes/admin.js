import express from 'express';
import AccessCode from '../models/AccessCode.js';
import User from '../models/User.js';
import Request from '../models/Request.js'; // We just created this!

const router = express.Router();

// --- 1. MAGIC FIX: GENERATE FAKE DATA ---
// Run this in your browser: http://localhost:5000/api/admin/seed
router.get('/seed', async (req, res) => {
    try {
        // 1. Create a Test Volunteer if none exist
        const volCount = await User.countDocuments({ role: 'volunteer' });
        if (volCount === 0) {
            await User.create({
                name: "Rahul Volunteer",
                email: "rahul@test.com",
                password: "hashedpassword123", // Fake password
                role: "volunteer",
                isVerified: false,
                govtId: "AADHAR-1234"
            });
            console.log("✅ Created Test Volunteer");
        }

        // 2. Create Test Rides if none exist
        const rideCount = await Request.countDocuments();
        if (rideCount === 0) {
            await Request.create([
                { requesterName: "Amit Kumar", type: "Ride to Hospital", status: "pending", price: 0 },
                { requesterName: "Sara Khan", type: "Grocery Help", status: "completed", volunteerName: "Rahul Volunteer", price: 0 },
                { requesterName: "John Doe", type: "Wheelchair Assist", status: "accepted", volunteerName: "Rahul Volunteer", price: 0 }
            ]);
            console.log("✅ Created Test Rides");
        }

        res.json({ message: "Database populated with Test Data! Refresh your Admin Panel." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 2. EXISTING ROUTES (Keep these!) ---
router.post('/generate-code', async (req, res) => {
    try {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        await AccessCode.create({ code: newCode });
        res.json({ code: newCode });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const volunteers = await User.countDocuments({ role: 'volunteer' });
        const users = await User.countDocuments({ role: 'user' });
        const rides = await Request.countDocuments();
        const recent = await Request.find().sort({ createdAt: -1 }).limit(5);
        
        res.json({ volunteers, users, rides, earnings: 0, recent });
    } catch (err) {
        res.status(500).json({ message: "Stats Error" });
    }
});

router.get('/volunteers', async (req, res) => {
    const volunteers = await User.find({ role: 'volunteer' });
    res.json(volunteers);
});

router.get('/rides', async (req, res) => {
    const rides = await Request.find().sort({ createdAt: -1 });
    res.json(rides);
});

router.put('/verify/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isVerified = !user.isVerified;
            await user.save();
            res.json({ isVerified: user.isVerified });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;