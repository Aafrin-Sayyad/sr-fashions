const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId:    { type: String, unique: true },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productId: String,
    title:     String,
    image:     String,
    price:     Number,
    quantity:  Number,
    color:     String,
    size:      String,
    addOns:    [{ name: String, price: Number }]
  }],
  shippingAddress: {
    fullName: String,
    phone:    String,
    line1:    String,
    line2:    String,
    city:     String,
    state:    String,
    pincode:  String
  },
  subtotal:      Number,
  total:         Number,
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'razorpay' },
  razorpayOrderId:   String,
  razorpayPaymentId: String,
  orderStatus: {
    type: String,
    enum: ['placed','confirmed','processing','shipped','delivered','cancelled'],
    default: 'placed'
  },
  whatsappSent:    { type: Boolean, default: false },
  deliveryWhatsappSent: { type: Boolean, default: false },
  notes:           String
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `SRF${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
