import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// --- 1. RESET DATABASE (Manual Trigger) ---
router.delete('/reset', async (req, res) => {
    try {
        await Request.deleteMany({});
        console.log("♻️ DATABASE MANUALLY WIPED");
        res.json({ message: "Reset Successful" });
    } catch (err) { res.status(500).json({ message: "Reset Failed" }); }
});

// --- 2. GET REQUESTS ---
router.get('/', async (req, res) => {
    try {
        const { volunteer } = req.query;
        let query = {};

        if (volunteer) {
             // Show Pending OR rides specifically assigned to this volunteer
             query = {
                 $or: [
                     { status: 'pending' },
                     { status: 'accepted', volunteerName: volunteer },
                     { status: 'in_progress', volunteerName: volunteer }
                 ]
             };
        }
        const requests = await Request.find(query).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// --- 3. CREATE RIDE ---
router.post('/', async (req, res) => {
    try {
        const newRequest = new Request({
            requesterName: req.body.requesterName || "User",
            type: req.body.type || 'Ride',
            price: req.body.price || 0,
            status: 'pending',
            pickup: req.body.pickup || "Kottayam",
            drop: req.body.drop || "Hospital"
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) { res.status(500).json({ message: "Failed" }); }
});

// --- 4. RIDE ACTIONS ---
router.put('/:id/:action', async (req, res) => {
    try {
        const { action } = req.params;
        const ride = await Request.findById(req.params.id);
        
        if (!ride) return res.status(404).json({ message: "Not Found" });

        if (action === 'accept') {
            if (ride.status !== 'pending') return res.status(400).json({ message: "Taken" });
            ride.status = 'accepted';
            ride.volunteerName = req.body.volunteerName;
        } 
        else if (action === 'pickup') {
            ride.status = 'in_progress';
        }
        else if (action === 'complete') {
            ride.status = 'completed';
        }

        await ride.save();
        res.json(ride);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

export default router;