// ============================================================
//  MODEL: Chat / Message
//  Per-user chat visible to admin in dashboard notifications
// ============================================================

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender:   { type: String, enum: ["user", "admin"], required: true },
    message:  { type: String, required: true },
    isRead:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
