import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import AccessCode from '../models/AccessCode.js'; 

const router = express.Router();

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, govtId, adminCode } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // 2. Normalize Email (Lower Case)
    const emailLower = email.toLowerCase();

    // 3. Check for existing user
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // 4. DETERMINE ROLE & VERIFICATION
    let finalRole = role || 'user';
    let isVerified = false;

    // ⚠️ FORCE ADMIN: If email is admin@assistall.com, make them Admin INSTANTLY
    if (emailLower === 'admin@assistall.com') {
        finalRole = 'admin';
        isVerified = true; // Auto-verify admin
        console.log("👑 Creating Super Admin Account");
    } 
    // Volunteer Check
    else if (finalRole === 'volunteer') {
      if (!adminCode) {
        return res.status(400).json({ message: "Admin Code is required for Volunteer registration." });
      }
      const validCode = await AccessCode.findOne({ code: adminCode, isUsed: false });
      if (!validCode) {
        return res.status(403).json({ message: "Invalid or Used Admin Code!" });
      }
      validCode.isUsed = true;
      await validCode.save();
      isVerified = true;
    }

    // 5. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create User
    const newUser = new User({
      name,
      email: emailLower,
      password: hashedPassword,
      role: finalRole,
      govtId: govtId || null,
      isVerified
    });

    const savedUser = await newUser.save();

    // 7. Generate Token Immediately
    const token = jwt.sign(
        { id: savedUser._id, role: savedUser.role, isVerified: savedUser.isVerified },
        process.env.JWT_SECRET || "fallback_secret_key", 
        { expiresIn: "3d" }
    );

    res.status(201).json({ user: savedUser, token });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const emailLower = req.body.email.toLowerCase();

    // 1. Find User
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 2. Validate Password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    // 3. SAFETY NET: If somehow the role is wrong, fix it now
    if (emailLower === 'admin@assistall.com' && user.role !== 'admin') {
        user.role = 'admin';
        user.isVerified = true;
        await user.save();
        console.log("⚡ Auto-fixed Admin Role on Login");
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, isVerified: user.isVerified },
      process.env.JWT_SECRET || "fallback_secret_key", 
      { expiresIn: "3d" }
    );

    // 5. Return
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token }); // Fixed: sending 'token' to match frontend expectation

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;