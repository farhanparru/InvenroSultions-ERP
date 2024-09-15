const mongoose = require('mongoose');

const addToSheetItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return new mongoose.Types.ObjectId().toString(); // Generate a unique ID if not provided
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
 description: {
    type: String,
    required: true,
    trim: true
  },
availability: {
    type: String,
    enum: ['in_stock', 'outofstock', 'preorder'],
    required: true
  },
  condition: {                               
    type: String,
    enum: ['new', 'used', 'refurbished'],
    required: true
  },
 price: {
    type: Number,
    required: true,
    min: 0
  },

  link: {
    type: String,
    required: true,  // You can set this to true if needed                  
    trim: true
  },
  brand: {
    type: String,
    required: true,// Set this to true if you want it to be mandatory
    trim: true
  },
  image_link: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AddToSheetItem', addToSheetItemSchema);
