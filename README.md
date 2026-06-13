# SR Fashions E-Commerce Platform

> Your Complete Family Store — Full MERN Stack Application

## 🗂️ Project Structure
```
sr-fashions/
├── backend/     ← Node.js + Express API
└── frontend/    ← React.js Customer + Admin UI
```

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev        # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start          # Runs on http://localhost:3000
```

## ✉️ Changing the Contact Email
To change the email shown on Contact Us / About pages:
1. Open `frontend/src/pages/ContactPage.jsx`
2. Find `dastagiris553@gmail.com` and replace with your new email
3. Do the same in `frontend/src/pages/AboutPage.jsx`
4. For backend OTP emails: update `EMAIL_USER` in your `.env` file
5. Redeploy frontend after changing.

## 🌐 Deployment (FREE — Recommended Stack)

| Service         | What it hosts          | Cost   |
|----------------|------------------------|--------|
| MongoDB Atlas  | Database               | Free   |
| Render.com     | Backend API            | Free   |
| Vercel         | React Frontend         | Free   |
| Cloudinary     | Images/Media           | Free   |

See full deployment guide in DEPLOYMENT.md

## 🔑 Adding Razorpay (When Ready)
1. Sign up at razorpay.com (free)
2. Get Key ID and Key Secret from Dashboard → Settings → API Keys
3. In your backend .env:  RAZORPAY_KEY_ID=rzp_live_xxx  RAZORPAY_KEY_SECRET=xxx  PAYMENT_MODE=live
4. Redeploy backend

## 📱 Adding WhatsApp (When Meta Approves)
1. Sign up at app.twilio.com (free tier available)
2. Enable WhatsApp Sandbox
3. In backend .env: TWILIO_ACCOUNT_SID=xxx  TWILIO_AUTH_TOKEN=xxx  TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
4. Redeploy backend

## 🔐 Creating Admin Account
```bash
# Run this once in MongoDB Atlas Shell or Compass:
db.users.insertOne({
  name: "SR Fashions Admin",
  email: "admin@srfashions.com",
  password: "$2a$12$...",  # bcrypt hash of your password
  role: "admin",
  isVerified: true
})
```
Or use the create-admin script below:
```bash
cd backend && node scripts/createAdmin.js
```
