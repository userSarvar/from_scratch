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
    ceopage: '$2b$10$iZEmIGaSQIjAOC3SKLYRkez3f.YMqa96lre/wY67V2DO7IG0MeUpa', // bcrypt hash for ceoPassword2200
    hrpage: '$2b$10$dprmXFZ/JZtrS.7I8Sc2Nul3VVuRPRNL/HZdSatLlBksf64BbvlJm', // bcrypt hash for hrPassword2200
    sv: '$2b$10$rGvRHYIMYJeBkVyBL6kFSu1K1vjENqBSfdooxKmQAw.o4vk24Bd7m', // bcrypt hash for svPassword2200
    promoter : '$2b$10$WmsN0kkJOdMKZdqkPv79c.fGbU1xuF4tB4sv7/EqLEHNe8foudFyS',// bcrypt hash for promoterPassword2200
};

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt with username: ${username}`);

    if (users[username]) {
        const match = await bcrypt.compare(password, users[username]);
        console.log(`Password match result: ${match}`);

        if (match) {
            let role;
            switch (username) {
                case 'ceopage':
                    role = 'retailCoordinator';
                    break;
                case 'hrpage':
                    role = 'hr';
                    break;

                case 'sv':
                    role = 'supervisor';
                    break;

                case 'promoter':
                    role = 'promoter';
                    break;  
                // Add other cases
            }
            console.log(`Login successful, role: ${role}`);
            return res.status(200).json({ role });
        } else {
            console.log(`Password mismatch for username: ${username}`);
        }
    } else {
        console.log(`Username not found: ${username}`);
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
