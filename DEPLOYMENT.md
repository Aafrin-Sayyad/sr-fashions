# SR Fashions — Free Deployment Guide

## Why This Stack? (Security + Free + MERN)
- **MongoDB Atlas** — Free 512MB, encrypted at rest, automatic backups
- **Render.com** — Free backend hosting, HTTPS auto-enabled, environment secrets protected
- **Vercel** — Free React hosting, global CDN, auto HTTPS
- **Cloudinary** — Free 25GB image storage
- **Razorpay** — PCI-DSS Level 1 compliant (most secure payment gateway in India)
- **OTP: Emailjs/Nodemailer** — Gmail SMTP (free, no cost for <500 emails/day)

---

## STEP 1 — MongoDB Atlas (Database)

1. Go to https://mongodb.com/atlas → Sign up free
2. Create a **Free Shared Cluster** (M0 tier — always free)
3. Create a database user (remember username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all — Render needs this)
5. Click **Connect → Connect your application**
6. Copy the connection string:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sr-fashions`

---

## STEP 2 — Cloudinary (Image Uploads)

1. Go to https://cloudinary.com → Sign up free
2. Go to Dashboard → copy:
   - Cloud Name
   - API Key
   - API Secret

---

## STEP 3 — Gmail OTP Setup

1. Enable 2FA on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Copy the 16-character password → use as EMAIL_PASS

---

## STEP 4 — Deploy Backend on Render.com

1. Push your code to GitHub (free account)
2. Go to https://render.com → Sign up with GitHub
3. Click **New → Web Service** → Connect your repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**
5. Add Environment Variables (paste from .env.example):
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=make_a_long_random_string_here_64chars
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=dastagiris553@gmail.com
   EMAIL_PASS=your_16char_app_password
   PAYMENT_MODE=dummy
   FRONTEND_URL=https://srfashions.vercel.app
   ```
6. Click **Deploy** → wait ~3 minutes
7. Your API will be at: `https://sr-fashions-backend.onrender.com`

---

## STEP 5 — Deploy Frontend on Vercel

1. Go to https://vercel.com → Sign up with GitHub
2. Click **New Project** → Import your repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Create React App
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://sr-fashions-backend.onrender.com
   ```
5. Click **Deploy** → ~2 minutes
6. Your site will be at: `https://srfashions.vercel.app`
7. (Optional) Add custom domain like `srfashions.com` — free in Vercel!

---

## STEP 6 — Create Admin Account

After backend is live, run locally:
```bash
cd backend
MONGO_URI="your_atlas_uri" node scripts/createAdmin.js
```
Then go to `https://srfashions.vercel.app/admin/login`
Email: admin@srfashions.com
Password: SRFashions@Admin2024
**Change the password immediately after first login!**

---

## STEP 7 — Upload Logo

Put your logo image at `frontend/public/logo.png`
The website uses `/logo.png` everywhere automatically.

---

## Adding Razorpay Later

1. Sign up at https://razorpay.com → free
2. Complete KYC (Aadhaar + business details)
3. Go to Settings → API Keys → Generate Live Keys
4. In Render.com → your backend → Environment:
   - `RAZORPAY_KEY_ID` = rzp_live_xxxxxxxx
   - `RAZORPAY_KEY_SECRET` = your_secret
   - `PAYMENT_MODE` = live
5. Render auto-redeploys → payments go live instantly!

---

## Security Notes (Already Built-In)
- All passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 30 days
- Admin routes double-protected (JWT + role check)
- CORS restricted to your frontend URL only
- Helmet.js sets secure HTTP headers
- Razorpay signature verification on every payment
- OTP expires in 10 minutes
- Rate limiting ready to add with express-rate-limit

---

## Changing Email Later
1. In Render.com → your backend → Environment Variables
2. Change EMAIL_USER to your new Gmail
3. Generate new App Password for new Gmail
4. Update EMAIL_PASS
5. In frontend code: find/replace `dastagiris553@gmail.com` in ContactPage.jsx and AboutPage.jsx
6. Redeploy Vercel frontend

---

## Monthly Cost Breakdown
| Service      | Cost    |
|-------------|---------|
| MongoDB Atlas| ₹0     |
| Render.com  | ₹0      |
| Vercel      | ₹0      |
| Cloudinary  | ₹0      |
| Gmail SMTP  | ₹0      |
| Razorpay    | 2% per transaction (no monthly fee!) |
| **TOTAL**   | **₹0 fixed cost!** |
