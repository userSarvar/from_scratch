// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://Samsunguser:0tddxGSOsHXadjLn@cluster0.w1z0c.mongodb.net/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Define a simple route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});











// server/app.js

// Assuming you have `DataModel` from database.js
const DataModel = require('./database');

app.get('/api/data', async (req, res) => {
    const data = await DataModel.find();
    res.json(data);
});

app.post('/api/data', async (req, res) => {
    const newData = new DataModel(req.body);
    await newData.save();
    res.status(201).send('Data created');
});
