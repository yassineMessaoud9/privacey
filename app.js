const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join('data.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save or update data
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

// Endpoint to get the current data
app.get('/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            res.status(500).json({ success: false, message: 'Error reading data' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
