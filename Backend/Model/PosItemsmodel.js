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
    type: String, // You can change this to Number or other types as needed
    required: true, // If the device field is mandatory, otherwise set to `false`
  }
});

module.exports = mongoose.model("POSItems", POSItemsSchema);
