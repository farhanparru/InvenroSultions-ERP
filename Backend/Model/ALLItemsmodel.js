const mongoose = require("mongoose");

const AllItemsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    MRP: {
      type: Number,
      required: false,
      min: 0,
    },
    ItemVariationName: {
      type: String,
      required: false,
    },
    ItemPosition: {
      type: String,
      required: false,
    },
    alternateItemName: {
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
    Barcode: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    device: {
      type: String,
      required: false,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemDevices",
      required: false,
    },
    description: {
      type: String,
      required: false,      
      trim: true,
    },
    link: {
      type: String,
      required: false, // You can set this to true if needed
      trim: true,
    },

    alternateDescription: {
      type: String,
      required: false,
    },
    alternateItemnameVariation: {
      type: String,
      required: false,
    },

    availability: {
      type: String,
      enum: ["in stock", "outofstock", "preorder"],
      required: false,
    },
    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      required: false,
    },
 
    location:{
      type:String,
      required: true,
    },

    brand: {
      type: String,
      required: false, // Set this to true if you want it to be mandatory
      trim: true,
    },

    Tax:{
      type:String,
      required: true,
    },

    image_link: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {}
);

// Create indexes
AllItemsSchema.index({ price: 1 });
AllItemsSchema.index({ id: 1 }); // Updated to match your schema property
``

// Export models for different collections
const Melparamba = mongoose.model("Melparamba", AllItemsSchema);
const Theruvath = mongoose.model("Theruvath", AllItemsSchema);
const Nayamaramoola = mongoose.model("Nayamaramoola", AllItemsSchema);

module.exports = { Melparamba, Theruvath, Nayamaramoola };