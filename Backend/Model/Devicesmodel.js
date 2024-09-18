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
    DevicesCreateDate:{
        type: Date,
        default: Date.now, // Store the current date as UTC
      },
});

const DevicesItem = mongoose.model('Device', createDevicesSchema);

module.exports = DevicesItem;
