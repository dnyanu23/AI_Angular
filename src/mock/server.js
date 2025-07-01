const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());

app.post('/weather', (req, res) => {
    const { city } = req.body;
    res.json({ city, temperature: '25°C', condition: 'Sunny' });
});

app.post('/translate', (req, res) => {
    const { data } = req.body;
    res.json({ response: `आमची मराठी` });
});

app.post('/send-mail', (req, res) => {
    const { data } = req.body;
    console.log('Sending email with data:', { data });
    res.json({ response: res.statusCode, message: 'Email sent successfully' });
});

app.post('/search', (req, res) => {
    const { data } = req.body;
    console.log('Sending Airbnb search data:', { data });
    res.json({ response: res.statusCode, message: 'Search results for Airbnb' });
});


app.listen(3005, () => console.log('Weather service on 3005'));
