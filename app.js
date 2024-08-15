const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log request method and URL
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.post('/save', (req, res) => {
    const { link, arabicPrivacy, englishPrivacy } = req.body;
    const data = { link, arabicPrivacy, englishPrivacy };

    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving data:', err);
            res.status(500).json({ success: false, message: 'Error saving data' });
        } else {
            res.json({ success: true, message: 'Data saved successfully!' });
        }
    });
});

app.get('/data', (req, res) => {
    console.log('GET /data request received');
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            res.status(500).json({ success: false, message: 'Error reading data' });
        } else {
            try {
                res.json(JSON.parse(data));
            } catch (e) {
                console.error('Error parsing JSON:', e);
                res.status(500).json({ success: false, message: 'Error parsing JSON' });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
