const mongoose = require('mongoose');

const categorySection = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [100, 'Category name cannot exceed 100 characters'],
        index: true  // Adding index for better performance in searches
    },
    arabicName: {
        type: String,
        required: [true, 'Arabic name is required'],
        trim: true,
        minlength: [3, 'Arabic name must be at least 3 characters long'],
        maxlength: [100, 'Arabic name cannot exceed 100 characters'],
        index: true  // Adding index for better performance in searches
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    arabicDescription: {
        type: String,
        required: [true, 'Arabic description is required'],
        trim: true,
        minlength: [10, 'Arabic description must be at least 10 characters long']
    },
    enterPosition: {
        type: Number,  // Assuming position is a numeric value
        required: [true, 'Enter position is required'],
        min: [1, 'Position must be at least 1'],
        max: [100, 'Position cannot exceed 100']
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Virtual for formatted category name
categorySection.virtual('formattedCategoryName').get(function() {
    return `${this.categoryName} (${this.arabicName})`;
});

// Method to get full description
categorySection.methods.getFullDescription = function() {
    return `${this.description}\n${this.arabicDescription}`;
};

const Category = mongoose.model('Category', categorySection);

module.exports = Category;
