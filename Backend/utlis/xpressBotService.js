const axios = require('axios');

const sendWhatsAppMessage = async (phoneNumber, message) => {
  const url = `https://app.xpressbot.org/api/v1/whatsapp/send`;

  const data = {
    sender: process.env.SENDER_PHONE_NUMBER,
    recipient: 9072937703,
    message: message,
  };

  const headers = {
    Authorization: `Bearer ${process.env.XPRESSBOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response,"kkk")
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { sendWhatsAppMessage };
