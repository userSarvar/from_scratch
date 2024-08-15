const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Samsunguser:0tddxGSOsHXadjLn@cluster0.w1z0c.mongodb.net/SamsungDjizzakh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

// Define a schema and model for promoter data
const promoterSchema = new mongoose.Schema({
    shortText: String,
    longText: String,
});

const PromoterData = mongoose.model('PromoterData', promoterSchema);

// Route to handle promoter form submissions
app.post('/submit-promoter', async (req, res) => {
    const { shortText, longText } = req.body;

    const newEntry = new PromoterData({
        shortText,
        longText,
    });

    try {
        await newEntry.save();
        res.send('Data submitted successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Failed to save data.');
    }
});

// Route to serve promoter.html
app.get('/promoter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/promoter.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Promoter server running on port ${PORT}`);
});
