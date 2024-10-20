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
      product_name: { type: String, required: true},
      product_quantity: { type: Number, required: true },
      product_currency: { type: String, required: true },
      unit_price: { type: Number, required: true },
    },
  ],
  orderMeta: {
    posOrderId: { type: Number, required: true },
    orderType: { type: String, required: true },
    paymentMethod: { type: String, required: true},
    paymentTendered: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, default: "Pending" },
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
});

// Main schema combining both arrays
const orderSchema = new mongoose.Schema({
  customerOnlineOrder: [customerOnlineOrderSchema],  // Array for customer online orders
  whatsappOnlineOrder: [whatsappOnlineOrderSchema],  // Array for WhatsApp online orders
});

// Export the model
module.exports = mongoose.model("OnlinePlatformOrder", orderSchema);
