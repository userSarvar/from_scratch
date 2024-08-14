// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Require authentication utilities
const auth = require('./utils/auth');

// Example route for user registration
app.post('/register', (req, res) => {
    const { password } = req.body;

    auth.hashPassword(password, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');
        
        // Save `hashedPassword` to the database here
        
        res.send('User registered');
    });
});

// Example route for user login
app.post('/login', (req, res) => {
    const { password } = req.body;
    
    // Retrieve `storedHash` from the database here
    
    const storedHash = 'stored_hash_from_db'; // Replace with actual hash retrieval

    auth.verifyPassword(password, storedHash, (err, match) => {
        if (err) return res.status(500).send('Error verifying password');
        
        if (match) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
