const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, sendEmailOTP, sendSMSOTP } = require('../utils/sendOTP');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return res.status(400).json({ message: 'Email or phone required' });
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    let user = await User.findOne(email ? { email } : { phone });
    if (!user) user = new User({ name: 'Customer', ...(email ? { email } : { phone }) });
    user.otp = { code: otp, expiresAt };
    await user.save();
    if (email) await sendEmailOTP(email, otp);
    else await sendSMSOTP(phone, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp, name } = req.body;
    const user = await User.findOne(email ? { email } : { phone });
    if (!user || !user.otp?.code) return res.status(400).json({ message: 'OTP not found' });
    if (user.otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (user.otp.code !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    user.isVerified = true;
    user.otp = undefined;
    if (name && user.name === 'Customer') user.name = name;
    await user.save();
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
const { protect } = require('../middleware/auth');
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
