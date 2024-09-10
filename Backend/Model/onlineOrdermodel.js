const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderDetails: [
      {
        product_name: String,
        product_quantity: Number,
        product_currency: String,
        unit_price: Number,  // Unit price added here
      }
    ],
    orderMeta: {
      posOrderId: Number,
      orderType: String,
      paymentMethod: String,
      paymentTendered: Number,
      orderDate: Date, // Store date as UTC
      paymentStatus: { type: String, default: 'Pending' },
    },
    customer: {
      name: String,
      phone: String,
    },
  
  });

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
