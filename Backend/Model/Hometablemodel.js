const mongoose = require('mongoose');

// Define the schema for tables
const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tableNumber: {
    type: Number,
    required: true,
    unique: true,  // Ensure table numbers are unique
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceCategory: {
    type: String,
    required: true,
    enum: ['Dine In', 'Delivery', 'Online', 'Parcel'],  
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',  // Reference to the Floor schema
    required: true,
  },
  createTableDate: {
    type: Date,
    default: Date.now, // Store the current date as UTC
  },
  isBlocked: {
    type: Boolean,
    default: false,  // Default to false, meaning the table is not blocked initially
  }
});

module.exports = mongoose.model('Table', tableSchema);
