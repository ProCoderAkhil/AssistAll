const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AccessCode = require('../models/AccessCode');
const Request = require('../models/Request');

// 1. Generate OTP Code (Admin sees this and tells Volunteer)
router.post('/generate-code', async (req, res) => {
    try {
        // Generate random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Delete old codes to keep it secure (only 1 active code at a time)
        await AccessCode.deleteMany({});

        const newCode = new AccessCode({ code });
        await newCode.save();

        res.json({ code });
    } catch (err) {
        res.status(500).json({ message: 'Generation failed' });
    }
});

// 2. Get Current Active Code (To display on Admin Dashboard)
router.get('/code', async (req, res) => {
    try {
        const activeCode = await AccessCode.findOne().sort({ createdAt: -1 });
        res.json({ code: activeCode ? activeCode.code : null });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 3. Get Volunteers (Pending List)
router.get('/volunteers', async (req, res) => {
    try {
        const volunteers = await User.find({ role: 'volunteer' }).select('-password');
        res.json(volunteers);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 4. Approve/Verify Volunteer (Final Button Click)
router.put('/verify/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Toggle status
        user.isVerified = !user.isVerified;
        user.verificationStatus = user.isVerified ? 'approved' : 'pending';
        
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
});

// 5. Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const volunteers = await User.countDocuments({ role: 'volunteer' });
        const users = await User.countDocuments({ role: 'user' });
        const rides = await Request.countDocuments({});
        const recent = await Request.find().sort({ createdAt: -1 }).limit(5);
        
        res.json({ volunteers, users, rides, earnings: rides * 150, recent });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;