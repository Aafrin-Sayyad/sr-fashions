const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId:    { type: String, required: true, unique: true },
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  category:     { type: String, required: true },
  subCategory:  { type: String },
  isPremium:    { type: Boolean, default: false },
  images:       [{ url: String, publicId: String }],
  youtubeShortUrl: { type: String, default: '' },
  youtubeVideoUrl: { type: String, default: '' },
  price:        { type: Number, required: true },
  mrp:          { type: Number },
  discount:     { type: Number, default: 0 },
  colors: [{
    name:  String,
    hex:   String,
    images:[String]
  }],
  addOns: [{
    name:  String,
    price: Number
  }],
  sizes:        [String],
  stock:        { type: Number, default: 0 },
  isSoldOut:    { type: Boolean, default: false },
  tags:         [String],
  ratings: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 }
  },
  isActive:     { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ title: 'text', tags: 'text' });
productSchema.index({ productId: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
