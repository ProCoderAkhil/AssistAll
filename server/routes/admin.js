const router = require('express').Router();
const AccessCode = require('../models/AccessCode');
const User = require('../models/User');
const Request = require('../models/Request');

// 1. DASHBOARD STATS (New!)
router.get('/stats', async (req, res) => {
    try {
        const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalRides = await Request.countDocuments({ status: 'completed' });
        
        // Calculate Total Platform Earnings (All rides combined)
        const allRides = await Request.find({ status: 'completed' });
        const totalEarnings = allRides.reduce((acc, curr) => acc + (curr.price || 0), 0);

        // Get Recent 5 Rides
        const recentRides = await Request.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            volunteers: totalVolunteers,
            users: totalUsers,
            rides: totalRides,
            earnings: totalEarnings,
            recent: recentRides
        });
    } catch (err) { res.status(500).json(err); }
});

// 2. GENERATE CODE
router.post('/generate-code', async (req, res) => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeEntry = new AccessCode({ code: newCode });
    await codeEntry.save();
    res.json({ code: newCode });
});

// 3. GET ALL VOLUNTEERS
router.get('/volunteers', async (req, res) => {
    const volunteers = await User.find({ role: 'volunteer' });
    res.json(volunteers);
});

// 4. GET ALL RIDES (For Ride History Page)
router.get('/rides', async (req, res) => {
    const rides = await Request.find().sort({ createdAt: -1 });
    res.json(rides);
});

// ... existing routes ...

// 5. TOGGLE VOLUNTEER VERIFICATION
router.put('/verify/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || user.role !== 'volunteer') {
            return res.status(404).json("Volunteer not found.");
        }
        
        user.isVerified = !user.isVerified; // Toggle status
        await user.save();

        res.json({ userId: user._id, isVerified: user.isVerified });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;