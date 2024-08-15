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

// Define a schema and model for user data
const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    name: String,
    role: String,
});

const User = mongoose.model('User', userSchema);

// Route to handle user form submissions
app.post('/submit-user', async (req, res) => {
    const { login, password, name, role } = req.body;

    const newUser = new User({
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

// Route to serve user.html
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user.html'));
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`User server running on port ${PORT}`);
});
