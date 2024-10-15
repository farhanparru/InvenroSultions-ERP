const mongoose = require("mongoose");

const POSItemsSchema = new mongoose.Schema(
  {
    ID: {
      type: String, // New field for the item ID
      required: true,
      unique: true, // Ensure itemID is unique
    },
    Itemname: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    MRP: {
      type: Number, // Field for Maximum Retail Price
      required: false, // Not mandatory
      min: 0,
    },
    ItemnameVariation: {
      type: String,
      required: false,
    },
    itemPosition: {
      type: String,
      required: false,
    },
    alternateName: {
      type: String,
      required: false,
    },
    foodType: {
      type: String,
      required: false,
    },
    shortCode: {
      type: String, // Changed to String for flexibility
      required: false,
    },
    barCode: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      index: true, // Index for faster queries on category
    },
    device: {
      type: String, // Store the device name
      required: false,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId, // Store the device ObjectId
      ref: "ItemDevices", // Reference the ItemDevices model
      required: false,
    },
    description: {
      type: String, // New field to store description
      required: false,
    },
    alternateDescription: {
      type: String, // New field to store an alternate description
      required: false,
    },
    alternateItemnameVariation: {
      type: String, // New field for an alternate variation
      required: false,
    },
  },
  {}
);

// Adding index for price and itemCode for faster retrieval
POSItemsSchema.index({ price: 1 });
POSItemsSchema.index({ itemCode: 1 });

module.exports = mongoose.model("POSItems", POSItemsSchema);
