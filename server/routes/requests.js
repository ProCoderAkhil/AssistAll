const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// 1. GET ALL REQUESTS (For User History)
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// ✅ 2. GET AVAILABLE REQUESTS (For Volunteers) - RELAXED FILTER
router.get('/available', async (req, res) => {
    try {
        // Fetch ALL pending requests regardless of time (fixes "No Request" bug)
        // Also fetch active rides for the specific volunteer
        const requests = await Request.find({
            $or: [
                { status: 'pending' }, 
                { status: { $in: ['accepted', 'in_progress'] } }
            ]
        }).sort({ createdAt: -1 });
        
        res.status(200).json(requests);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// 3. CREATE REQUEST
router.post('/', async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const newRequest = new Request({
            ...req.body,
            pickupOTP: otp,
            status: 'pending', // Ensure status is set
            createdAt: new Date()
        });
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. UPDATE STATUS
router.put('/:id/:action', async (req, res) => {
    try {
        const { action } = req.params;
        const { volunteerId, volunteerName, otp, rating, review, tip, paymentMethod } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) return res.status(404).json({ message: "Request not found" });

        if (action === 'accept') {
            if (request.status !== 'pending') return res.status(409).json({ message: "Ride taken" });
            request.status = 'accepted';
            request.volunteerId = volunteerId;
            request.volunteerName = volunteerName;
        } 
        else if (action === 'pickup') {
            if (request.pickupOTP !== otp) return res.status(400).json({ message: "Incorrect OTP" });
            request.status = 'in_progress';
        } 
        else if (action === 'complete') {
            request.status = 'completed';
        }
        else if (action === 'cancel') {
            request.status = 'cancelled';
        }
        else if (action === 'rate' || action === 'review') {
            request.rating = rating;
            request.review = review;
        }

        await request.save();
        res.json(request);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 5. LEADERBOARD
router.get('/leaderboard', async (req, res) => {
    try {
        const stats = await Request.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: "$volunteerName", rides: { $sum: 1 }, earnings: { $sum: "$price" } } },
            { $sort: { rides: -1 } },
            { $limit: 5 }
        ]);
        res.json(stats);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

module.exports = router;