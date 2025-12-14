const router = require('express').Router();
const User = require('../models/User');
const AccessCode = require('../models/AccessCode');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, govtId, adminCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("Email already exists!");

    // VOLUNTEER CHECK
    let isVerified = false;
    if (role === 'volunteer') {
        const validCode = await AccessCode.findOne({ code: adminCode, isUsed: false });
        if (!validCode) {
            return res.status(403).json("Invalid or Used Admin Code!");
        }
        validCode.isUsed = true; // Burn the code
        await validCode.save();
        isVerified = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, email, password: hashedPassword, role: role || 'user', govtId, isVerified
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password!");

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;