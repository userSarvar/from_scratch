const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { zonedTimeToUtc } = require('date-fns-tz');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Function to get local time in Tashkent timezone
const getLocalTime = (timezone) => {
    const date = new Date();
    return zonedTimeToUtc(date, timezone);
};

// MongoDB connection
mongoose.connect('mongodb+srv://Samsunguser:0tddxGSOsHXadjLn@cluster0.w1z0c.mongodb.net/SamsungDjizzakh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

// Define Schemas
const promoterSchema = new mongoose.Schema({
    shortText: String,
    longText: String,
    createdAt: {
        type: Date,
        default: () => getLocalTime('Asia/Tashkent') // Tashkent timezone
    }
});

const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    name: String,
    role: String,
    createdAt: {
        type: Date,
        default: () => getLocalTime('Asia/Tashkent') // Tashkent timezone
    }
});

// Define Models
const PromoterData = mongoose.model('PromoterData', promoterSchema);
const UserData = mongoose.model('UserData', userSchema);

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
        console.error('Error saving data:', error.stack);
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
