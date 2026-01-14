const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  const { 
      name, email, password, role, phone, 
      // Volunteer fields
      govtId, serviceSector, drivingLicense, vehicleDetails, selfieImage, phoneVerified, agreedToTerms,
      // User fields
      emergencyContact, medicalCondition, prefersLargeText, needsWheelchair
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name, email, password: hashedPassword, role, phone,
      
      // User Specific
      emergencyContact: emergencyContact || {},
      medicalCondition: medicalCondition || '',
      preferences: {
          largeText: prefersLargeText || false,
          wheelchair: needsWheelchair || false
      },

      // Volunteer Specific
      phoneVerified: phoneVerified || false,
      agreedToTerms: agreedToTerms || false,
      selfieImage: selfieImage || '',
      serviceSector: serviceSector || 'general',
      govtId: govtId || '',
      drivingLicense: drivingLicense || '',
      vehicleDetails: vehicleDetails || {},

      // Status Logic
      isVerified: role === 'user' ? true : false, 
      verificationStatus: role === 'volunteer' ? 'pending' : 'approved'
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
            preferences: user.preferences // Send back prefs for UI adjustment
        } 
    });

  } catch (err) { 
      console.error(err);
      res.status(500).json({ message: 'Server Error' }); 
  }
});

// ... (keep existing login/admin routes)

module.exports = router;