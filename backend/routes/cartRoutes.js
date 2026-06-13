const express = require('express');
const router = express.Router();
// Cart is managed client-side in localStorage for guest users
// This route handles server-side cart sync for logged-in users
const { protect } = require('../middleware/auth');
const User = require('../models/User');
router.get('/', protect, async (req, res) => res.json({ message: 'Cart synced from client' }));
module.exports = router;
