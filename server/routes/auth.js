import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import AccessCode from '../models/AccessCode.js'; 

const router = express.Router();

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, govtId, adminCode } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "Fill all fields." });

    const emailClean = email.trim().toLowerCase();
    
    const existing = await User.findOne({ email: emailClean });
    if (existing) return res.status(400).json({ message: "User exists." });

    let finalRole = role || 'user';
    let isVerified = false;

    // Admin Logic
    if (emailClean === 'admin@assistall.com') {
        finalRole = 'admin';
        isVerified = true;
    } else if (finalRole === 'volunteer') {
        if (!adminCode) return res.status(400).json({ message: "Admin Code required." });
        const validCode = await AccessCode.findOne({ code: adminCode, isUsed: false });
        if (!validCode) return res.status(403).json({ message: "Invalid Code." });
        validCode.isUsed = true;
        await validCode.save();
        isVerified = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const newUser = new User({
      name: name.trim(),
      email: emailClean,
      password: hashedPassword,
      role: finalRole,
      govtId,
      isVerified
    });

    await newUser.save();

    // ⚠️ 30 DAY TOKEN
    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || "fallback_secret", 
        { expiresIn: "30d" }
    );

    res.status(201).json({ user: newUser, token });

  } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const emailClean = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(req.body.password.trim(), user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    // Auto-Fix Admin Role
    if (emailClean === 'admin@assistall.com' && user.role !== 'admin') {
        user.role = 'admin';
        user.isVerified = true;
        await user.save();
    }

    // ⚠️ 30 DAY TOKEN (PERSISTENT LOGIN)
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "fallback_secret", 
        { expiresIn: "30d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });

  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;