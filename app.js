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
    timestamp: { type: Date, default: Date.now }, // Timestamp field
});

const PromoterData = mongoose.model('PromoterData', promoterSchema);

const svSchema = new mongoose.Schema({
    username: String,
    handle: String,
    role: String,
    age: String,
    timestamp: { type: Date, default: Date.now }, // Timestamp field
});

const svData = mongoose.model('svData', svSchema);

// Route to handle promoter form submissions
app.post('/submit-promoter', async (req, res) => {
    const { shortText, longText } = req.body;

    console.log(req.body);  // Debugging: Log the request body

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



// Route to handle promoter form submissions
app.post('/submit-sv', async (req, res) => {
    const { username, handle, role, age } = req.body;

    console.log(req.body);  // Debugging: Log the request body

    const newEntry = new svData({
        username,
        handle, 
        role, 
        age,
    });

    try {
        await newEntry.save();
        res.send('sv data submitted successfully!');
    } catch (error) {
        console.error('Error saving promoter data:', error);
        res.status(500).send('Failed to save promoter data.');
    }
});



// Route to get promoter data with optional date filter
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

        // Convert timestamps to local time zone
        const formattedData = data.map(item => {
            item.timestamp = new Date(item.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Tashkent' });
            return item;
        });

        res.json(formattedData);
    } catch (err) {
        console.error('Error retrieving promoter data:', err);
        res.status(500).send('Error retrieving data');
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

        const data = await svData.find(query).exec();

        // Convert timestamps to local time zone
        const formattedData = data.map(item => {
            item.timestamp = new Date(item.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Tashkent' });
            return item;
        });

        res.json(formattedData);
    } catch (err) {
        console.error('Error retrieving sv data:', err);
        res.status(500).send('Error retrieving data');
    }
});



// Route to update promoter data
app.put('/update-promoter-data/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = {
        shortText: req.body.shortText,
        longText: req.body.longText,
        timestamp: req.body.timestamp
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






// Route to update sv data
app.put('/update-sv-data/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = {
        username: req.body.username,
        handle: req.body.handle,
        role: req.body.role,
        age: req.body.age,
        timestamp: req.body.timestamp
    };

    try {
        const result = await svData.updateOne({ _id: id }, { $set: updatedData });
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




// Define routes for static pages
app.get('/promoter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/promoter.html'));
});


// Define routes for static pages
app.get('/sv', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sv.html'));
});




// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
