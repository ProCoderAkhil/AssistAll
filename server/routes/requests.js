const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// 1. GET ALL REQUESTS (Simplified)
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. CREATE REQUEST
router.post('/', async (req, res) => {
    try {
        const newRequest = new Request({
            requesterName: req.body.requesterName || "User",
            requesterId: req.body.requesterId,
            type: req.body.type || 'Ride',
            price: req.body.price || 150,
            status: 'pending',
            pickup: req.body.pickup || "Kottayam",
            drop: req.body.drop || "Hospital"
        });
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(500).json({ message: "Failed to create request" });
    }
});

// 3. RIDE ACTIONS
router.put('/:id/:action', async (req, res) => {
    try {
        const { action } = req.params;
        const ride = await Request.findById(req.params.id);
        
        if (!ride) return res.status(404).json({ message: "Not Found" });

        if (action === 'accept') {
            if (ride.status !== 'pending') return res.status(400).json({ message: "Taken" });
            ride.status = 'accepted';
            ride.volunteerName = req.body.volunteerName;
            ride.volunteerId = req.body.volunteerId;
        } 
        else if (action === 'pickup') {
            ride.status = 'in_progress';
        }
        else if (action === 'complete') {
            ride.status = 'completed';
        }

        await ride.save();
        res.json(ride);
    } catch (err) {
        res.status(500).json({ message: "Action Failed" });
    }
});

// 4. Update Payment/Tip
router.put('/:id/tip', async (req, res) => {
    try {
        const updated = await Request.findByIdAndUpdate(req.params.id, { 
            tip: req.body.amount,
            paymentMethod: req.body.paymentMethod 
        }, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;