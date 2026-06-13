
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('../models/User');

  const existing = await User.findOne({ email: 'admin@srfashions.com' });
  if (existing) { console.log('Admin already exists!'); process.exit(0); }

  const password = await bcrypt.hash('SRFashions@Admin2024', 12);
  await User.create({
    name: 'SR Fashions Admin',
    email: 'admin@srfashions.com',
    password,
    role: 'admin',
    isVerified: true
  });
  console.log('✅ Admin created!');
  console.log('   Email: admin@srfashions.com');
  console.log('   Password: SRFashions@Admin2024');
  console.log('   ⚠️  CHANGE THIS PASSWORD after first login!');
  process.exit(0);
};

createAdmin().catch(err => { console.error(err); process.exit(1); });
