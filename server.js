const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the websaite directory
app.use(express.static(path.join(__dirname, 'websaite')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'websaite', 'website.html'));
});

// Results route
app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'websaite', 'results.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});