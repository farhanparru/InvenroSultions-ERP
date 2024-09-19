const mongoose = require("mongoose");

const POSItemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  Itemcode: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  Device: {
    type: String, // Store the device name
    required: true,
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId, // Store the device ObjectId
    ref: "ItemDevices", // Reference the ItemDevices model
    required: true,
  },
});

module.exports = mongoose.model("POSItems", POSItemsSchema);
