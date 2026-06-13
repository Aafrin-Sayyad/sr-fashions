const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    sender:    { type: String, enum: ['user', 'admin'] },
    text:      String,
    createdAt: { type: Date, default: Date.now },
    isRead:    { type: Boolean, default: false }
  }],
  isResolved: { type: Boolean, default: false },
  lastMessage:{ type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
