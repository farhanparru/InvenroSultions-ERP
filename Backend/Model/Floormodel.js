const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  gratuity: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumPartySize: {
    type: Number,
    required: true,
    min: 1,
  },
  createFloorDate: {
    type: Date,
    default: Date.now, // Store the current date as UTC
  },

});

module.exports = mongoose.model('Floor', floorSchema);
