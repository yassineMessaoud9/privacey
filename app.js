const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port

// Connect to MongoDB
mongoose.connect('mongodb+srv://medyassineemessaoud:ODhSmmOXBPrqLYRv@priv.qoya0.mongodb.net/?retryWrites=true&w=majority&appName=priv', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema and model for the data
const privacySchema = new mongoose.Schema({
    link: String,
    arabicPrivacy: String,
    englishPrivacy: String,
});

const Privacy = mongoose.model('Privacy', privacySchema);

app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware to log request method and URL
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.post('/save', async (req, res) => {
    const { link, arabicPrivacy, englishPrivacy } = req.body;
    const data = { link, arabicPrivacy, englishPrivacy };

    try {
        await Privacy.findOneAndUpdate({}, data, { upsert: true, new: true });
        res.json({ success: true, message: 'Data saved successfully!' });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ success: false, message: 'Error saving data' });
    }
});

app.get('/data', async (req, res) => {
    console.log('GET /data request received');
    try {
        const data = await Privacy.findOne();
        res.json(data || {});
    } catch (err) {
        console.error('Error reading data:', err);
        res.status(500).json({ success: false, message: 'Error reading data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
