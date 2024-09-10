const mongoose = require('mongoose');

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fourDigitPasscode: {
    type: String,
    required: false,
    length: 4,  // Ensure it's exactly 4 digits
  },
  sixDigitPasscode: {
    type: String,
    required: true,
    length: 6,  // Ensure it's exactly 6 digits
  },
  type: {
    type: String,
    enum: ['staff', 'delivery', 'waiter'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  roles: {
    type: String,
    enum: ['Admin', 'Employe'],  // You can extend this list with more roles
    required: true
  },
  location: {
    type: String,  // If location is a single string (like an address or city)
    required: true
  },
 createEmployeeDate: {
    type: Date,
    default: Date.now, // Store the current date as UTC
  },

});

// Create the Employee Model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
