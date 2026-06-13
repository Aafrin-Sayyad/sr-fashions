const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');
const { sendWhatsApp, orderConfirmationMsg } = require('../utils/sendWhatsApp');

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user._id });
    // Send WhatsApp confirmation
    const phone = order.shippingAddress.phone;
    if (phone) {
      sendWhatsApp(phone, orderConfirmationMsg(order)).catch(console.error);
    }
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'title images');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
