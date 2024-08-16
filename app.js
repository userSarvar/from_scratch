const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
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

// Define schemas and models
const promoterSchema = new mongoose.Schema({
    shortText: String,
    longText: String,
});

const PromoterData = mongoose.model('PromoterData', promoterSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to check if request is from admin
const adminOnly = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader !== process.env.ADMIN_SECRET) {
        return res.sendStatus(403); // Forbidden
    }
    next();
};

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

// Route to handle user registration
app.post('/register', adminOnly, async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        role,
    });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            // Create JWT token for session management
            const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ message: `Welcome ${user.role}`, token });
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch {
        res.status(500).send('Error during authentication');
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
