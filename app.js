const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to add Tashkent time to the request
app.use((req, res, next) => {
    const tashkentTime = moment().tz('Asia/Tashkent').format();
    req.tashkentTime = tashkentTime;
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

// Hashed passwords for users
const users = {
    ceopage: '$2b$10$uQ1pD/xfEY2Q7Z9qHlW9ieV74tgtREVsKwGzZtJS9B7u6y/RKhf9K', // bcrypt hash for ceoPassword2200
    hrpage: '$2b$10$dW2lmtM6bFzF4p9Ghg1gRe67EbzU14iQjG3iYCeZqR.5OCEmvDbUK', // bcrypt hash for hrPassword2200
    // Add other users similarly
};

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'ceopage' && password === 'ceoPassword2200') {
        return res.status(200).json({ role: 'retailCoordinator' });
    } else if (username === 'hrpage' && password === 'hrPassword2200') {
        return res.status(200).json({ role: 'hr' });
    }

    return res.status(401).json({ message: 'Invalid username or password' });
});


// Define schemas and models
const promoterSchema = new mongoose.Schema({
    shortText: String,
    longText: String,
    timestamp: { type: Date, default: Date.now },
    editedTime: Date
});

const PromoterData = mongoose.model('PromoterData', promoterSchema);

const svSchema = new mongoose.Schema({
    username: String,
    handle: String,
    role: String,
    age: Number,
    timestamp: { type: Date, default: Date.now },
    editedTime: Date
});

const SVData = mongoose.model('SVData', svSchema);

// Routes for promoter data
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

app.get('/get-promoter-data', async (req, res) => {
    try {
        const dateFilter = req.query.date;
        let query = {};

        if (dateFilter) {
            const startDate = new Date(dateFilter);
            const endDate = new Date(dateFilter);
            endDate.setDate(endDate.getDate() + 1);

            query = { timestamp: { $gte: startDate, $lt: endDate } };
        }

        const data = await PromoterData.find(query).exec();

        const formattedData = data.map(item => ({
            ...item.toObject(),
            timestamp: new Date(item.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Tashkent' })
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Error retrieving promoter data:', err);
        res.status(500).send('Error retrieving data');
    }
});

app.put('/update-promoter-data/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = {
        shortText: req.body.shortText,
        longText: req.body.longText,
        editedTime: new Date() // Update editedTime to current time
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

// Routes for SV data
app.post('/submit-sv', async (req, res) => {
    const { username, handle, role, age } = req.body;

    const newEntry = new SVData({
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

app.get('/get-sv-data', async (req, res) => {
    try {
        const dateFilter = req.query.date;
        let query = {};

        if (dateFilter) {
            const startDate = new Date(dateFilter);
            const endDate = new Date(dateFilter);
            endDate.setDate(endDate.getDate() + 1);

            query = { timestamp: { $gte: startDate, $lt: endDate } };
        }

        const data = await SVData.find(query).exec();

        const formattedData = data.map(item => ({
            ...item.toObject(),
            timestamp: new Date(item.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Tashkent' })
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Error retrieving SV data:', err);
        res.status(500).send('Error retrieving data');
    }
});

app.put('/update-sv-data/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = {
        username: req.body.username,
        handle: req.body.handle,
        role: req.body.role,
        age: req.body.age,
        editedTime: new Date() // Update editedTime to current time
    };

    try {
        const result = await SVData.updateOne({ _id: id }, { $set: updatedData });
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

// Serve static files
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
