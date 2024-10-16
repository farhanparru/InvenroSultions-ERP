const mongoose = require('mongoose');

const createDevicesSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        required: true,
    },
    Devices: {
        type: String,
        required: true,
        enum: ['printer', 'Waiter', 'KOT'], // Limit the values to these options
    },
    ID: {
        type: Number,
        required: true,
        unique: true // Ensure the ID is unique
    },
    Code: {
        type: String,
        required: true,
        unique: true // Ensure the Code is unique
    },
    IPAddress: { // New field for IP address
        type: String,
        required: true, // Set required to true if the IP address must always be provided
    },
    DevicesCreateDate: {
        type: Date,
        default: Date.now, // Store the current date as UTC
    },
});

const DevicesItem = mongoose.model('Device', createDevicesSchema);

module.exports = DevicesItem;
