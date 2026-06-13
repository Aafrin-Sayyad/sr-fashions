const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { sendWhatsApp, deliveryConfirmationMsg } = require('../utils/sendWhatsApp');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenue] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }])
    ]);
    res.json({ totalOrders, totalUsers, totalProducts, revenue: revenue[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All orders
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ orders, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update order status
router.put('/orders/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true }).populate('user');
    if (req.body.status === 'delivered' && !order.deliveryWhatsappSent) {
      sendWhatsApp(order.shippingAddress.phone, deliveryConfirmationMsg(order)).catch(console.error);
      await Order.findByIdAndUpdate(req.params.id, { deliveryWhatsappSent: true });
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password -otp').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// User order history
router.get('/users/:id/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Categories CRUD
router.get('/categories', protect, adminOnly, async (req, res) => {
  try { res.json(await Category.find().sort({ order: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/categories', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Category.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/categories/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/categories/:id', protect, adminOnly, async (req, res) => {
  try { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Public categories
router.get('/categories/public', async (req, res) => {
  try { res.json(await Category.find({ isActive: true }).sort({ order: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
