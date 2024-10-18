const mongoose = require("mongoose");

const OnlineItemSchema = new mongoose.Schema({

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
  },
});

const customerOnlineOrder = new mongoose.Schema({
  Id: {
    type: Number,
    required: true,
  },

  OnlineorderDate: {
    type: Date,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
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
      "cancelled"
    ],
  },

  customerName: {
    type: String,
    required: true,
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
  items: {
    type: [OnlineItemSchema], // Array of OrderItem objects
    required: true,
  },

  orderNotes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("CustomeronlineOrder", customerOnlineOrder);
