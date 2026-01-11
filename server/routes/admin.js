import express from 'express';
import AccessCode from '../models/AccessCode.js';
import User from '../models/User.js'; // Optional: if you want to see stats

const router = express.Router();

// --- GET ACTIVE CODE ---
router.get('/code', async (req, res) => {
    try {
        // Find the most recent unused code
        const latestCode = await AccessCode.findOne({ isUsed: false }).sort({ createdAt: -1 });
        res.json({ code: latestCode ? latestCode.code : null });
    } catch (err) {
        res.status(500).json({ message: "Error fetching code" });
    }
});

// --- GENERATE NEW CODE ---
router.post('/generate-code', async (req, res) => {
    try {
        // 1. Generate a random 6-character string (Numbers + Uppercase)
        const newCodeString = Math.random().toString(36).substring(2, 8).toUpperCase();

        // 2. Save to Database
        const newCode = new AccessCode({
            code: newCodeString,
            isUsed: false
        });
        await newCode.save();

        console.log(`✅ Generated New OTP: ${newCodeString}`);
        res.json({ code: newCodeString });

    } catch (err) {
        console.error("Code Gen Error:", err);
        res.status(500).json({ message: "Failed to generate code" });
    }
});

// --- GET DASHBOARD STATS (Optional but good for Admin Panel) ---
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
        res.json({ users: totalUsers, volunteers: totalVolunteers });
    } catch (err) {
        res.status(500).json({ message: "Stats Error" });
    }
});

export default router;