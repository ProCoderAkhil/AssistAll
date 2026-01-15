const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// ---------------------------------------------------------
// 🔐 RAZORPAY CONFIGURATION
// ---------------------------------------------------------
const razorpay = new Razorpay({
    key_id: 'rzp_test_S44Rgy9G3Yrika', 
    key_secret: '8reBkMy18bV3SQGPcPgZx4ff',
});

// 1. CREATE ORDER
router.post('/orders', async (req, res) => {
    try {
        const { amount } = req.body;
        
        const options = {
            amount: amount * 100, // Convert Rupee to Paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ message: "Error creating order" });
    }
});

// 2. VERIFY PAYMENT
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
            .createHmac('sha256', 'G2VpSZXzQN7HGSu9zsgSKvAc')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ status: "success", paymentId: razorpay_payment_id });
        } else {
            res.status(400).json({ status: "failure" });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ status: "error" });
    }
});

module.exports = router;