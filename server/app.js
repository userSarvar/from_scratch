const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Samsunguser:0tddxGSOsHXadjLn@cluster0.w1z0c.mongodb.net/yourDatabaseName', {
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

// Route to handle form submissions
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

// Define routes for static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/promoter', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/promoter.html'));
});

// Define API routes
app.get('/api/data', async (req, res) => {
    const data = await PromoterData.find();
    res.json(data);
});

app.post('/api/data', async (req, res) => {
    const newData = new PromoterData(req.body);
    await newData.save();
    res.status(201).send('Data created');
});

// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
