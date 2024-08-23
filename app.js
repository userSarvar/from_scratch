const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment-timezone');

const app = express();

// Middleware to parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // Set the timezone to Asia/Tashkent
    req.tashkentTime = moment().tz('Asia/Tashkent').format();
    next();
});

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Samsunguser:0tddxGSOsHXadjLn@cluster0.w1z0c.mongodb.net/SamsungDjizzakh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

// Define schemas and models
const promoterSchema = new mongoose.Schema({
    shortText: String,
    longText: String,
    timestamp: { type: Date, default: Date.now },
});

const PromoterData = mongoose.model('PromoterData', promoterSchema);

const svSchema = new mongoose.Schema({
    username: String,
    handle: String,
    role: String,
    age: String,
    timestamp: { type: Date, default: Date.now },
});

const svData = mongoose.model('svData', svSchema);

// Route to handle promoter form submissions
app.post('/submit-promoter', async (req, res) => {
    const { shortText, longText } = req.body;

    const newEntry = new PromoterData({
        shortText,
        longText,
    });

    try {
        await newEntry.save();
        res.send('Promoter data submitted successfully!');
    } catch (error) {
        console.error('Error saving promoter data:', error);
        res.status(500).send('Failed to save promoter data.');
    }
});

// Route to handle SV form submissions
app.post('/submit-sv', async (req, res) => {
    const { username, handle, role, age } = req.body;

    const newEntry = new svData({
        username,
        handle,
        role,
        age,
    });

    try {
        await newEntry.save();
        res.send('SV data submitted successfully!');
    } catch (error) {
        console.error('Error saving SV data:', error);
        res.status(500).send('Failed to save SV data.');
    }
});

// Route to get promoter data with optional date filter
app.get('/get-promoter-data', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        let query = {};

        if (start_date && end_date) {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            endDate.setHours(23, 59, 59, 999);

            query.timestamp = { $gte: startDate, $lte: endDate };
        }

        const data = await PromoterData.find(query).exec();

        const formattedData = data.map(item => ({
            ...item.toObject(),
            timestamp: moment(item.timestamp).tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss'),
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Error retrieving promoter data:', err);
        res.status(500).send('Error retrieving data');
    }
});

// Route to get SV data with optional date filter
app.get('/get-sv-data', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        let query = {};

        if (start_date && end_date) {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            endDate.setHours(23, 59, 59, 999);

            query.timestamp = { $gte: startDate, $lte: endDate };
        }

        const data = await svData.find(query).exec();

        const formattedData = data.map(item => ({
            ...item.toObject(),
            timestamp: moment(item.timestamp).tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss'),
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Error retrieving SV data:', err);
        res.status(500).send('Error retrieving data');
    }
});

// Route to update promoter data
app.put('/update-promoter-data/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = {
        shortText: req.body.shortText,
        longText: req.body.longText,
        timestamp: req.body.timestamp || Date.now(),
    };

    try {
        const result = await PromoterData.updateOne({ _id: id }, { $set: updatedData });
        if (result.nModified === 1) {
            res.send('Data updated successfully');
        } else {
            res.status(404).send('Data not found or no changes made');
        }
    } catch (error) {
        console.error('Error updating promoter data:', error);
        res.status(500).send('Failed to update promoter data');
    }
});

// Route to update SV data
app.put('/update-sv-data/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = {
        username: req.body.username,
        handle: req.body.handle,
        role: req.body.role,
        age: req.body.age,
        timestamp: req.body.timestamp || Date.now(),
    };

    try {
        const result = await svData.updateOne({ _id: id }, { $set: updatedData });
        if (result.nModified === 1) {
            res.send('Data updated successfully');
        } else {
            res.status(404).send('Data not found or no changes made');
        }
    } catch (error) {
        console.error('Error updating SV data:', error);
        res.status(500).send('Failed to update SV data');
    }
});

// Define routes for static pages
app.get('/promoter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/promoter.html'));
});

app.get('/sv', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sv.html'));
});

// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
