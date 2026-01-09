import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Ensure you have a User model!

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Simple check to prevent duplicates
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User exists" });

        const newUser = new User({ name, email, password, role: role || 'user' });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.status(201).json({ user: newUser, token });
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.password !== password) return res.status(400).json({ message: "Invalid credentials" }); // In production use bcrypt

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.json({ user, token });
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

export default router;