
import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const PORT = 3001;

// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'chatbot.db');

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
        console.error('Error creating counter table:', err);
      } else {
        // Initialize counter if not exists
        db.get('SELECT * FROM counter WHERE id = 1', (err, row) => {
          if (!row) {
            db.run('INSERT INTO counter (id, value) VALUES (1, 0)');
          }
        });
      }
    });
    
    // Create config table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating config table:', err);
      } else {
        // Initialize default config values if not exists
        initializeDefaultConfig();
      }
    });
  }
});

// Initialize default configuration values with empty strings
const initializeDefaultConfig = () => {
  const defaultConfig = {
    'API_ENDPOINT': '',
    'API_KEY': '',
    'ADMIN_PASSWORD': '',
    'CONTACT_NAME': '',
    'CONTACT_TITLE': '',
    'CONTACT_PHOTO': '',
    'CONTACT_MEETING': '',
    'CONTACT_LINKEDIN': '',
    'COMPANY_NAME': ''
  };
  
  Object.entries(defaultConfig).forEach(([key, value]) => {
    db.get('SELECT * FROM config WHERE key = ?', [key], (err, row) => {
      if (err) {
        console.error(`Error checking config for ${key}:`, err);
      } else if (!row) {
        db.run('INSERT INTO config (key, value) VALUES (?, ?)', [key, value], (err) => {
          if (err) {
            console.error(`Error inserting default config for ${key}:`, err);
          } else {
            console.log(`Default configuration for ${key} initialized with empty value`);
          }
        });
      }
    });
  });
};

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

// Route to get all config values
app.get('/api/config', (req, res) => {
  db.all('SELECT key, value FROM config', (err, rows) => {
    if (err) {
      console.error('Error reading config:', err);
      return res.status(500).json({ error: 'Error reading configuration' });
    }
    
    // Convert rows to an object
    const config = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    
    res.json(config);
  });
});

// Route to get a specific config value
app.get('/api/config/:key', (req, res) => {
  const { key } = req.params;
  db.get('SELECT value FROM config WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(`Error reading config for ${key}:`, err);
      return res.status(500).json({ error: `Error reading configuration for ${key}` });
    }
    
    if (!row) {
      return res.status(404).json({ error: `Configuration key ${key} not found` });
    }
    
    res.send(row.value);
  });
});

// Route to update a config value
app.post('/api/config/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (!value && value !== '') {
    return res.status(400).json({ error: 'Value is required' });
  }
  
  db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', [key, value], (err) => {
    if (err) {
      console.error(`Error updating config for ${key}:`, err);
      return res.status(500).json({ error: `Error updating configuration for ${key}` });
    }
    
    res.json({ success: true, message: `Configuration for ${key} updated successfully` });
  });
});

// Route to update multiple config values
app.post('/api/config', (req, res) => {
  const configs = req.body;
  
  if (!configs || typeof configs !== 'object') {
    return res.status(400).json({ error: 'Valid configuration object is required' });
  }
  
  const promises = Object.entries(configs).map(([key, value]) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', [key, String(value)], (err) => {
        if (err) {
          console.error(`Error updating config for ${key}:`, err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
  
  Promise.all(promises)
    .then(() => {
      res.json({ success: true, message: 'Configuration updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: 'Error updating configuration', details: err.message });
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
  console.log(`API server running on http://localhost:${PORT}`);
});
