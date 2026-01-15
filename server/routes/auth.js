const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- 1. REGISTER ---
router.post('/register', async (req, res) => {
  const { 
      name, email, password, role, phone, address, gender, // ✅ Added gender
      // Volunteer
      govtId, serviceSector, drivingLicense, medicalCertificate, // ✅ Added medicalCertificate
      vehicleDetails, selfieImage, phoneVerified, agreedToTerms,
      // User
      emergencyContact, medicalCondition, prefersLargeText, needsWheelchair
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name, email, password: hashedPassword, role, phone, address,
      gender: gender || 'Male', // ✅ Save Gender

      // User Data
      emergencyContact: emergencyContact || {},
      medicalCondition: medicalCondition || '',
      preferences: {
          largeText: prefersLargeText || false,
          wheelchair: needsWheelchair || false
      },

      // Volunteer Data
      phoneVerified: phoneVerified || false,
      agreedToTerms: agreedToTerms || false,
      selfieImage: selfieImage || '',
      serviceSector: serviceSector || 'general',
      govtId: govtId || '',
      drivingLicense: drivingLicense || '',
      medicalCertificate: medicalCertificate || '', // ✅ Save Medical Cert
      vehicleDetails: vehicleDetails || {},

      // Status
      isVerified: role === 'user' ? true : false, 
      verificationStatus: role === 'volunteer' ? 'pending' : 'approved',
      interviewStatus: 'pending'
    });

    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ 
        token, 
        user: { 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            isVerified: user.isVerified,
            preferences: user.preferences
        } 
    });

  } catch (err) { 
      console.error("Register Error:", err.message);
      res.status(500).json({ message: 'Server Error' }); 
  }
});

// --- 2. LOGIN (Keep existing) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        if (user.role === 'volunteer' && !user.isVerified) {
            return res.status(403).json({ message: 'Account Pending Admin Approval' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { _id: user._id, name: user.name, role: user.role, isVerified: user.isVerified, preferences: user.preferences } });
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// --- 3. INTERVIEW COMPLETION (Keep existing) ---
router.put('/complete-interview/:id', async (req, res) => {
    try {
        const { adminCode } = req.body;
        const VALID_ADMIN_CODE = "VERIFIED24"; 

        if (adminCode !== VALID_ADMIN_CODE) {
            return res.status(400).json({ message: "Invalid Code. Ask Admin." });
        }

        await User.findByIdAndUpdate(req.params.id, { interviewStatus: 'completed' });
        res.json({ message: "Interview Verified" });
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

module.exports = router;