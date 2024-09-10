const mongoose = require('mongoose')


const ExcelItems = new mongoose.Schema({
    Id: String,
    ItemName: String,
    category: String,
    Price: Number,
})

const Item = mongoose.model('SheetItems', ExcelItems);

module.exports = Item;