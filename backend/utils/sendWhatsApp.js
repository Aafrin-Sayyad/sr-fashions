const sendWhatsApp = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'your_twilio_sid') {
    console.log(`[WhatsApp MOCK] To: +91${to}\n${message}`); return;
  }
  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({ from: process.env.TWILIO_WHATSAPP_FROM, to: `whatsapp:+91${to}`, body: message });
};
const orderConfirmationMsg = (order) =>
`🛍️ *SR Fashions* - Order Confirmed!\nHi ${order.shippingAddress.fullName}! 🎉\nOrder ID: ${order.orderId}\nTotal: ₹${order.total}\nDelivery: ${order.shippingAddress.city}\nThank you! 👨‍👩‍👧‍👦 📞 7659983786`;
const deliveryConfirmationMsg = (order) =>
`✅ *SR Fashions* - Delivered!\nHi ${order.shippingAddress.fullName}! Order ${order.orderId} delivered! 💖\nThank you for shopping! 📞 7659983786`;
module.exports = { sendWhatsApp, orderConfirmationMsg, deliveryConfirmationMsg };
