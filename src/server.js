
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001; // Using 3001 to avoid conflicts with the frontend dev server
const COUNTER_FILE = path.join(__dirname, 'config/counter.txt');

// Enable CORS for all routes to allow frontend to access the API
app.use(cors());

// Parse text and JSON request bodies
app.use(express.text());
app.use(express.json());

// Ensure the counter file exists
const ensureCounterFile = () => {
  if (!fs.existsSync(COUNTER_FILE)) {
    try {
      fs.writeFileSync(COUNTER_FILE, '0');
      console.log('Counter file created successfully');
    } catch (err) {
      console.error('Error creating counter file:', err);
    }
  }
};

ensureCounterFile();

// Route to get the counter value
app.get('/api/counter', (req, res) => {
  fs.readFile(COUNTER_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading counter file:', err);
      return res.status(500).send('Error reading counter');
    }
    const count = data.trim() || '0';
    res.send(count);
  });
});

// Route to increment the counter
app.post('/api/counter/increment', (req, res) => {
  fs.readFile(COUNTER_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading counter file:', err);
      return res.status(500).send('Error reading counter');
    }
    
    const count = parseInt(data.trim() || '0', 10);
    const newCount = isNaN(count) ? 1 : count + 1;
    
    fs.writeFile(COUNTER_FILE, newCount.toString(), (err) => {
      if (err) {
        console.error('Error writing to counter file:', err);
        return res.status(500).send('Error writing counter');
      }
      res.send(newCount.toString());
    });
  });
});

app.listen(PORT, () => {
  console.log(`Counter API server running on http://localhost:${PORT}`);
});
