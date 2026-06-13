const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/chat/my
router.get('/my', protect, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) chat = await Chat.create({ user: req.user._id, messages: [] });
    res.json(chat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/chat/message
router.post('/message', protect, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) chat = new Chat({ user: req.user._id, messages: [] });
    chat.messages.push({ sender: 'user', text: req.body.text });
    chat.lastMessage = new Date();
    await chat.save();
    res.json(chat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: GET all chats
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const chats = await Chat.find().populate('user', 'name email phone').sort({ lastMessage: -1 });
    res.json(chats);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: reply to chat
router.post('/admin/reply/:chatId', protect, adminOnly, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    chat.messages.push({ sender: 'admin', text: req.body.text });
    chat.lastMessage = new Date();
    await chat.save();
    res.json(chat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
