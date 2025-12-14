const router = require('express').Router();
const Request = require('../models/Request');

// 1. UPDATE PAYMENT & TIP
router.put('/:id/tip', async (req, res) => {
    try {
        const updated = await Request.findByIdAndUpdate(req.params.id, { 
            tip: req.body.amount,
            paymentMethod: req.body.paymentMethod // <--- Saving 'cash' or 'online'
        }, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json(err); }
});

// 2. GET EARNINGS
router.get('/earnings/:volunteerId', async (req, res) => {
    try {
        const jobs = await Request.find({ 
            volunteerId: req.params.volunteerId, 
            status: 'completed',
            payoutStatus: 'unpaid'
        });

        let totalBase = 0;
        let totalTips = 0;

        jobs.forEach(job => {
            // Include cash payments in earnings history, but marks them differently in real apps
            // For this demo, we assume cash is kept by volunteer and online is transferred
            totalBase += (job.price || 0);
            totalTips += (job.tip || 0);
        });

        res.json({ total: totalBase + totalTips, base: totalBase, tips: totalTips, jobs: jobs.length });
    } catch (err) { res.status(500).json(err); }
});

// 3. WITHDRAW
router.post('/withdraw/:volunteerId', async (req, res) => {
    try {
        await Request.updateMany(
            { volunteerId: req.params.volunteerId, status: 'completed', payoutStatus: 'unpaid' },
            { $set: { payoutStatus: 'paid' } }
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// 4. CREATE REQUEST
router.post('/', async (req, res) => {
  try {
    const distanceVal = (Math.random() * 5 + 2).toFixed(1); 
    const priceVal = Math.floor(40 + (distanceVal * 15)); 
    const newRequest = new Request({
        ...req.body,
        distance: `${distanceVal} km`,
        price: priceVal,
        eta: `${Math.floor(distanceVal * 1.5) + 2} mins`,
        tip: 0,
        paymentMethod: 'pending'
    });
    const savedRequest = await newRequest.save();
    res.status(200).json(savedRequest);
  } catch (err) { res.status(500).json(err); }
});

// 5. STANDARD ROUTES
router.get('/', async (req, res) => {
  try { const requests = await Request.find(); res.status(200).json(requests); } catch (err) { res.status(500).json(err); }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const history = await Request.find({ 
      $or: [{ requesterId: req.params.userId }, { volunteerId: req.params.userId }]
    }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (err) { res.status(500).json(err); }
});

router.put('/:id/accept', async (req, res) => {
  try { const updated = await Request.findByIdAndUpdate(req.params.id, { status: 'accepted', volunteerName: req.body.volunteerName, volunteerId: req.body.volunteerId }, { new: true }); res.status(200).json(updated); } catch (err) { res.status(500).json(err); }
});

router.put('/:id/pickup', async (req, res) => {
  const updated = await Request.findByIdAndUpdate(req.params.id, { status: 'in_progress' }, { new: true }); res.json(updated);
});

router.put('/:id/complete', async (req, res) => {
  const updated = await Request.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true }); res.json(updated);
});

module.exports = router;