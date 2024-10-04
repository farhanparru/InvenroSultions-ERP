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
  itemCode: {
    type: String, // Changed to String for flexibility (e.g., leading zeros)
    required: true,
    unique: true, // Ensure uniqueness
  },
  itemVariation: {
    type: String,
    required: true,
  },
  itemPosition: {
    type: String,
    required: true,
  },
  alternateName: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String, // Changed to String for flexibility
    required: true,
  },
  barCode: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true, // Index for faster queries on category
  },
  device: {
    type: String, // Store the device name
    required: true,
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId, // Store the device ObjectId
    ref: "ItemDevices", // Reference the ItemDevices model
    required: true,
  },
}, {
  timestamps: true, // Automatically add `createdAt` and `updatedAt` timestamps
});

// Adding index for price and itemCode for faster retrieval
POSItemsSchema.index({ price: 1 });
POSItemsSchema.index({ itemCode: 1 });

module.exports = mongoose.model("POSItems", POSItemsSchema);
