const mongoose = require('mongoose');

// Define the schema for tables
const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceCategory: {
    type: String,
    required: true,
    enum: ['Dine In', 'Delivery', 'Online','Parcel'],  
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',  // Reference to the Floor schema
    required: true,
  },
  createTableDate: {
    type: Date,
    default: Date.now, // Store the current date as UTC
  }
});

module.exports = mongoose.model('Table', tableSchema);
