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
    default: ""
  },
  price: {
    type: Number,
    required: true,
    default: ""
  },
  notes: {
    type: String, 
    default: "",
  },
});

const orderSchema = new mongoose.Schema({
  orderDetails: [
    {
      product_name: { type: String, required: true , default: "",},
      product_quantity: { type: Number, required: true,  default: "", },
      product_currency: { type: String, required: true,  default: "", },
      unit_price: { type: Number, required: true,  default: "", },
    },
  ],
  orderMeta: {
    posOrderId: { type: Number, required: true,  default: "", },
    orderType: { type: String, required: true,  default: "", },
    paymentMethod: { type: String, required: true,  default: "", },
    paymentTendered: { type: Number, required: true,  default: "", },
    orderDate: { type: Date, default: Date.now }, // Store date as UTC
    paymentStatus: { type: String, default: 'Pending',  default: "", },
  },
  customer: {
    name: { type: String, required: true,  default: "", },
    phone: { type: String, required: true,  default: "", },
  },
  // Additional fields
  Id: {
    type: Number,
    required: true,
    default: "",
  },
  OnlineorderDate: {
    type: Date,
    required: true,
    default: "",
  },
  totalAmount: {
    type: Number,
    required: true,
    default: "",
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
      "cancelled",
    ],
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
        return /^\+?[1-9]\d{1,14}$/.test(v); // Regular expression to validate phone number with country code
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  Items: {
    type: [ITEMSCHEMA], // Array of OrderItem objects
    required: true,
    default: "",
  },
  orderNotes: {
    type: String,
    required: false,
  },
});

// Export the model
module.exports = mongoose.model("OnlinePlatformOrder", orderSchema);
