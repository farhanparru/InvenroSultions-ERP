const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        minlength: 2
    },
    place: {
        type: String,
        required: true,
        trim: true,
    },
    number: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\+\d{1,4} \d{6,15}$/.test(v); // Validates phone number with country code
            },
            message: props => `${props.value} is not a valid phone number with country code!`
        }
    },
    customeraddDate: {
        type: Date, // Store date as UTC
        required: true,
        default: Date.now // Optional: Set default to current date and time
    }
}, {
   
});

module.exports = mongoose.model('Customer', customerSchema);
