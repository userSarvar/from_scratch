const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment-timezone');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // Set the timezone to Asia/Tashkent
    const tashkentTime = moment().tz('Asia/Tashkent').format();
    req.tashkentTime = tashkentTime; // Making the time available in req object for routes
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
    timestamp: String, // Storing the timestamp as string to avoid timezone conversion issues
});


const PromoterData = mongoose.model('PromoterData', promoterSchema);

const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    name: String,
    role: String,
});

const UserData = mongoose.model('UserData', userSchema);

// Route to handle promoter form submissions
app.post('/submit-promoter', async (req, res) => {
    const { shortText, longText } = req.body;

    const newEntry = new PromoterData({
        shortText,
        longText,
        timestamp: req.tashkentTime, // Using the timezone-specific time
    });

    try {
        await newEntry.save();
        res.send('Promoter data submitted successfully!');
    } catch (error) {
        console.error('Error saving promoter data:', error);
        res.status(500).send('Failed to save promoter data.');
    }
});

// Route to handle user form submissions
app.post('/submit-user', async (req, res) => {
    const { login, password, name, role } = req.body;

    const newUser = new UserData({
        login,
        password,
        name,
        role,
    });

    try {
        await newUser.save();
        res.send('User data submitted successfully!');
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Failed to save user data.');
    }
});



app.get('/get-promoter-data', async (req, res) => {
    try {
        const data = await PromoterData.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching promoter data:', error);
        res.status(500).send('Failed to fetch promoter data.');
    }
});


// Define routes for static pages
app.get('/promoter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/promoter.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user.html'));
});

// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
