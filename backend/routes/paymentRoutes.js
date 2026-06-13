const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const crypto = require('crypto');

const PAYMENT_MODE = process.env.PAYMENT_MODE || 'dummy';

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (PAYMENT_MODE === 'dummy') {
      return res.json({
        mode: 'dummy',
        orderId: `dummy_order_${Date.now()}`,
        amount,
        currency: 'INR',
        key: 'dummy_key'
      });
    }
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await rzp.orders.create({ amount: amount * 100, currency: 'INR', receipt: `srf_${Date.now()}` });
    res.json({ mode: 'live', orderId: order.id, amount, currency: 'INR', key: process.env.RAZORPAY_KEY_ID });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    if (PAYMENT_MODE === 'dummy') {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', orderStatus: 'confirmed', razorpayPaymentId: 'dummy_payment' });
      return res.json({ verified: true });
    }
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expected !== razorpaySignature) return res.status(400).json({ message: 'Payment verification failed' });
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', orderStatus: 'confirmed', razorpayOrderId, razorpayPaymentId });
    res.json({ verified: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
