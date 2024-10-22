const mongoose = require("mongoose");

const ITEMSCHEMA = new mongoose.Schema({
  ItemName: {
    type: String,
    required: true,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
    default: 0  // Changed default to 0 as it's a number
  },
  price: {
    type: Number,
    required: true,
    default: 0  // Changed default to 0 as it's a number
  },
  notes: {
    type: String, 
    default: "",
  },
});

// Schema for customerOnlineOrder
const customerOnlineOrderSchema = new mongoose.Schema({
  Id: {
    type: Number,
    required: true,
    default: 0,  // Changed default to 0 as it's a number
  },
  OnlineorderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,  // Changed default to 0 as it's a number
  },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      "Placed",
      "Confirmed",
      "Ready",
      "Completed",
      "Dispatched",
      "Assigned",
      "Printed",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",  // Set default status
  },
  customerName: {
    type: String,
    required: true,
    default: "",
  },
  customerPhone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);  // Validate phone number with country code
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    default: "",
  },
  Items: {
    type: [ITEMSCHEMA],  // Array of items
    required: true,
    default: [],
  },
  orderNotes: {
    type: String,
    required: false,
    default: "",
  },
});

// Schema for whatsappOnlineOrder
const whatsappOnlineOrderSchema = new mongoose.Schema({
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
      orderDate: Date, 
      paymentStatus: { type: String, default: 'Pending' },
      orderStatus: { type: String, default: 'Pending' },   // Order status defaults to Pending
    },
    customer: {
      name: String,
      phone: String,
    },
});

// Main schema combining both arrays
const orderSchema = new mongoose.Schema({
  customerOnlineOrder: [customerOnlineOrderSchema],  // Array for customer online orders
  whatsappOnlineOrder: [whatsappOnlineOrderSchema],  // Array for WhatsApp online orders
});

// Export the model
module.exports = mongoose.model("OnlinePlatformOrder", orderSchema);
