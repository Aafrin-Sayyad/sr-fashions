const nodemailer = require('nodemailer');
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, port: parseInt(process.env.EMAIL_PORT),
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: `"SR Fashions" <${process.env.EMAIL_USER}>`, to: email,
    subject: 'SR Fashions - OTP Code',
    html: `<div style="font-family:'Times New Roman',serif;padding:30px;border:1px solid #e8d5b7;">
      <h2 style="color:#1a3a5c">OTP Verification</h2>
      <div style="font-size:36px;font-weight:bold;color:#c8a96e;letter-spacing:8px;margin:20px 0">${otp}</div>
      <p style="color:#888;font-size:13px">Expires in 10 minutes.</p></div>`
  });
};
const sendSMSOTP = async (phone, otp) => {
  const axios = require('axios');
  await axios.post('https://www.fast2sms.com/dev/bulkV2',
    { variables_values: otp, route: 'otp', numbers: phone },
    { headers: { authorization: process.env.FAST2SMS_API_KEY } }
  );
};
module.exports = { generateOTP, sendEmailOTP, sendSMSOTP };
