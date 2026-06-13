// ============================================================
//  ROUTES: Cart
// ============================================================
const cartRouter = require("express").Router();
const Cart       = require("../models/Cart");
const Product    = require("../models/Product");
const { protect } = require("../middleware/auth");

cartRouter.use(protect);

cartRouter.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name images price discountPrice isSoldOut");
    res.json({ cart: cart || { items: [] } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

cartRouter.post("/add", async (req, res) => {
  try {
    const { productId, colour, quantity = 1, addons = [] } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    if (product.isSoldOut) return res.status(400).json({ message: "Product is sold out." });

    const price = product.discountPrice || product.price;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, colour, quantity, addons, price }] });
    } else {
      const idx = cart.items.findIndex(
        (i) => i.product.toString() === productId && i.colour === colour
      );
      if (idx > -1) cart.items[idx].quantity += quantity;
      else cart.items.push({ product: productId, colour, quantity, addons, price });
      await cart.save();
    }
    await cart.populate("items.product", "name images price discountPrice");
    res.json({ message: "Added to cart!", cart });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

cartRouter.put("/update/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });
    if (quantity <= 0) cart.items.pull(req.params.itemId);
    else item.quantity = quantity;
    await cart.save();
    res.json({ cart });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

cartRouter.delete("/remove/:itemId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ message: "Removed.", cart });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

cartRouter.delete("/clear", async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: "Cart cleared." });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ============================================================
//  ROUTES: Chat
// ============================================================
const chatRouter  = require("express").Router();
const Message     = require("../models/Message");
const { protect: prot2, adminOnly } = require("../middleware/auth");

chatRouter.use(prot2);

chatRouter.get("/my", async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort("createdAt");
    res.json({ messages });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

chatRouter.post("/send", async (req, res) => {
  try {
    const msg = await Message.create({ user: req.user._id, sender: "user", message: req.body.message });
    res.status(201).json({ message: msg });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: all unread chats
chatRouter.get("/admin/all", adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "name phone email")
      .sort("-createdAt").limit(100);
    const unreadCount = await Message.countDocuments({ sender: "user", isRead: false });
    res.json({ messages, unreadCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: reply
chatRouter.post("/admin/reply", adminOnly, async (req, res) => {
  try {
    const { userId, message } = req.body;
    const msg = await Message.create({ user: userId, sender: "admin", message });
    // Mark user messages as read
    await Message.updateMany({ user: userId, sender: "user", isRead: false }, { isRead: true });
    res.status(201).json({ message: msg });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ============================================================
//  ROUTES: Payment (Razorpay)
// ============================================================
const payRouter = require("express").Router();
const { protect: prot3 } = require("../middleware/auth");

payRouter.post("/create-order", prot3, async (req, res) => {
  try {
    const Razorpay = require("razorpay");
    const rzp = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount } = req.body; // in paise
    const order = await rzp.orders.create({
      amount:   Math.round(amount * 100),
      currency: "INR",
      receipt:  "receipt_" + Date.now(),
    });
    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

payRouter.post("/verify", prot3, (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (sign === razorpay_signature) res.json({ verified: true });
    else res.status(400).json({ verified: false, message: "Invalid signature." });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ============================================================
//  ROUTES: Feedback
// ============================================================
const feedbackRouter = require("express").Router();
const { protect: prot4 } = require("../middleware/auth");

feedbackRouter.post("/", prot4, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    // In a full app: save to Feedback model. Here, send via WhatsApp to admin.
    if (process.env.SHOP_WHATSAPP) {
      // Could also use nodemailer here
    }
    res.json({ message: "Thank you for your feedback!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = {
  cartRouter,
  chatRouter,
  payRouter,
  feedbackRouter,
};
