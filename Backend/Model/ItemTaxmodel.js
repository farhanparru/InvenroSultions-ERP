const mongoose = require("mongoose");

const TaxItemSchema = new mongoose.Schema({
  Taxname: {
    type: String,
    required: true,
  },
  Percentage: {
    type: String, // Changed to String to store percentage with the "%" symbol
    required: true,
  },
  TaxType: {
    type: String,
    enum: ["Add Tax to Item Price", "Include Tax in Item Price"],
    required: true,
  },
  TaxMode: {
    type: String,
    enum: ["Exclusive", "Inclusive"], // Automatically set based on TaxType
    required: false,
  },
  TaxcreateDate: {
    type: Date,
    default: Date.now, // Store the current date as UTC
  },
});

// Middleware to set TaxMode based on TaxType before saving
TaxItemSchema.pre("save", function (next) {
  if (this.TaxType === "Add Tax to Item Price") {
    this.TaxMode = "Exclusive";
  } else if (this.TaxType === "Include Tax in Item Price") {
    this.TaxMode = "Inclusive";
  }
  next();
});

const TaxItem = mongoose.model("TaxItem", TaxItemSchema);

module.exports = TaxItem;
