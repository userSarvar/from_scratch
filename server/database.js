// server/database.js
const mongoose = require('mongoose');

// Define a schema
const DataSchema = new mongoose.Schema({
    field1: String,
    field2: Number,
    field3: Boolean,
});

// Create a model
const DataModel = mongoose.model('DataModel', DataSchema);

// Export the model for use in other parts of the application
module.exports = DataModel;
