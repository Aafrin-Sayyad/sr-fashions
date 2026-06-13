// ============================================================
//  MODEL: Cart
// ============================================================

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  colour:   String,
  quantity: { type: Number, default: 1, min: 1 },
  addons:   [{ name: String, price: Number }],
  price:    Number,   // snapshot at add-to-cart time
});

const cartSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Virtual: total
cartSchema.virtual("total").get(function () {
  return this.items.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.addons || []).reduce((a, b) => a + b.price, 0) * item.quantity,
    0
  );
});

module.exports = mongoose.model("Cart", cartSchema);
