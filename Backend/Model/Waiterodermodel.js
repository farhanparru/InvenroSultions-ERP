const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  id: {
    type: String, // Unique identifier for each order item
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  notes: {
    type: String, // Any additional notes related to the order item
    default: "",
  }
});

const WaiterSchema = new mongoose.Schema({
  billnumber: {
    type: Number,
    required: true,
  },
  OdercreateDate: {
    type: Date,
    default: Date.now, // Store the current date as UTC
  },
 tableIds: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
    required: true,
    ref: 'Table' // Optional: reference the 'Table' collection if you have one
  },
  items: {
    type: [OrderItemSchema], // Array of OrderItem objects
    required: true,
  },
  subTotal: {
    type: Number, // The subtotal amount before tax
    required: true,
  },
  tax: {
    type: Number, // Tax applied on the order
    required: true,
  },
  total: {
    type: Number, // Total amount including tax
    required: true,
  },
  orderStatus: {
    type: String, // Status of the order (e.g., "Pending", "Completed", etc.)
    required: true,
    enum: [  "Blocked",, "Occupied", , "Billed"], // Optional: restrict to specific statuses
  },
  customerName: {
    type: String, // Name of the customer
    required: true,
  },
  priceCategory: {
    type: String, // Category of price (e.g., "Regular", "Discount", etc.)
    required: true,
    enum: ["DineIn", "Delivery", "Online","Parcel"] // Optional: restrict to specific categories
  }
});

module.exports = mongoose.model("Waiter", WaiterSchema);
