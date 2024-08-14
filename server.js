const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Data storage file
const dataFile = path.join(__dirname, 'data', 'hydroponics_data.json');

// Endpoint to receive data
app.post('/api/data', (req, res) => {
    const data = req.body;
    if (data && Array.isArray(data)) {
        fs.readFile(dataFile, 'utf8', (err, fileData) => {
            if (err) return res.status(500).send('Error reading data file.');

            let existingData = [];
            try {
                existingData = JSON.parse(fileData);
            } catch (e) {
                // No previous data or malformed JSON
            }

            existingData.push(...data);

            fs.writeFile(dataFile, JSON.stringify(existingData, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing data file.');
                res.status(200).send('Data saved successfully.');
            });
        });
    } else {
        res.status(400).send('Invalid data format.');
    }
});

// Endpoint to download CSV
app.get('/api/download', (req, res) => {
    fs.readFile(dataFile, 'utf8', (err, fileData) => {
        if (err) return res.status(500).send('Error reading data file.');

        let existingData = [];
        try {
            existingData = JSON.parse(fileData);
        } catch (e) {
            return res.status(500).send('Error parsing data.');
        }

        let csvContent = "Time,EC Level (mS/cm),pH Level\n";
        csvContent += existingData.map(d => `${d.time},${d.ecLevel},${d.phLevel}`).join("\n");

        res.setHeader('Content-disposition', 'attachment; filename=hydroponics_data.csv');
        res.set('Content-Type', 'text/csv');
        res.send(csvContent);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
