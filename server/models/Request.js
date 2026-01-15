const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// 1. GET ALL REQUESTS (For Users to track their specific ride history/status)
router.get('/', async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        // Users need to see everything relevant to them
        const requests = await Request.find({
            createdAt: { $gte: twentyFourHoursAgo }
        }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// ✅ 2. NEW: GET AVAILABLE REQUESTS (For Volunteers Only)
router.get('/available', async (req, res) => {
    try {
        const thirtyMinutesAgo = new Date(new Date().getTime() - (30 * 60 * 1000));
        
        // Volunteers should ONLY see 'pending' requests that are recent
        // We also want to see their own active rides ('accepted', 'in_progress')
        const requests = await Request.find({
            $or: [
                { status: 'pending', createdAt: { $gte: thirtyMinutesAgo } },
                { status: { $in: ['accepted', 'in_progress'] } } // To keep active ride on screen
            ]
        }).sort({ createdAt: -1 });
        
        res.status(200).json(requests);
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// ... (Keep existing POST, PUT, LEADERBOARD routes exactly as they are)
// CREATE REQUEST
router.post('/', async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const newRequest = new Request({ ...req.body, pickupOTP: otp });
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE STATUS
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
        else if (action === 'review' || action === 'rate') {
            request.rating = rating;
            request.review = review;
        }

        await request.save();
        res.json(request);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// LEADERBOARD
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