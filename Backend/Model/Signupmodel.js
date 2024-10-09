const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define Admin Registration Schema
const AdminRegisterSchema = new mongoose.Schema({
  
  // Business Type
  selectBusinessType: {
    type: String,
    required: true,
    enum: [
      'Restaurant',
      'Bar & Restaurant',
      'Cloud Kitchen',
      'Resto Bar & Pub',
      'Others',
      'Cafe',
      'Ice Cream Parlour',
      'Food Truck',
      'Juice Shop'
    ] // restricts to predefined business types
  },

  // Email Address
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ] // Email format validation
  },

   // Phone Number with Country Code
   phoneNumber: {
    type: String,
    required: true,
    match: [
      /^\+?[1-9]{1}[0-9]{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,9}$/,
      'Please provide a valid phone number with country code'
    ] // Supports formats like +123-456-7890, +12 (345) 6789012, +1234567890
  },

  // Password
  password: {
    type: String,
    required: true,
  }
});

// Password encryption hook before saving the Admin data
AdminRegisterSchema.pre('save', async function (next) {
  const user = this;


  // Only hash the password if it's new or has been modified
  if (!user.isModified('password')) return next();

  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    console.log("Salt generated:", salt);
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(user.password, salt);
    console.log("Hashed password:", hashedPassword);

    // Store the hashed password
    user.password = hashedPassword;
    
    next();
  } catch (error) {
    return next(error);
  }
});

// Create the model
const AdminRegister = mongoose.model('AdminRegister', AdminRegisterSchema);

module.exports = AdminRegister;
