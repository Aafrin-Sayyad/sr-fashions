const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, unique: true, sparse: true, lowercase: true },
  phone:       { type: String, unique: true, sparse: true },
  password:    { type: String },
  role:        { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified:  { type: Boolean, default: false },
  avatar:      { type: String, default: '' },
  addresses: [{
    label:    String,
    fullName: String,
    phone:    String,
    line1:    String,
    line2:    String,
    city:     String,
    state:    String,
    pincode:  String,
    isDefault:{ type: Boolean, default: false }
  }],
  otp:          { code: String, expiresAt: Date },
  createdAt:    { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
