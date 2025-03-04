
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'counter.db');

// Enable CORS
app.use(cors());
app.use(express.text());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create counter table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS counter (
        id INTEGER PRIMARY KEY,
        value INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        // Initialize counter if not exists
        db.get('SELECT * FROM counter WHERE id = 1', (err, row) => {
          if (!row) {
            db.run('INSERT INTO counter (id, value) VALUES (1, 0)');
          }
        });
      }
    });
  }
});

// Route to get the counter value
app.get('/api/counter', (req, res) => {
  db.get('SELECT value FROM counter WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Error reading counter:', err);
      return res.status(500).send('Error reading counter');
    }
    res.send(String(row ? row.value : 0));
  });
});

// Route to increment the counter
app.post('/api/counter/increment', (req, res) => {
  db.run('UPDATE counter SET value = value + 1 WHERE id = 1', (err) => {
    if (err) {
      console.error('Error incrementing counter:', err);
      return res.status(500).send('Error incrementing counter');
    }
    
    // Get the new value
    db.get('SELECT value FROM counter WHERE id = 1', (err, row) => {
      if (err) {
        console.error('Error reading counter after increment:', err);
        return res.status(500).send('Error reading counter');
      }
      res.send(String(row.value));
    });
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Counter API server running on http://localhost:${PORT}`);
});

