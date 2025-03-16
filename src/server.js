const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow React frontend to access backend
    methods: ['GET'],
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// API Route to Fetch Quotes
app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data); // Send the quote to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
