
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

// Initialize default configuration values
const initializeDefaultConfig = () => {
  const defaultConfig = {
    'API_ENDPOINT': 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1',
    'API_KEY': 'eyJhbGciOiJFZERTQSJ9.eyJwcm9qZWN0IjoiMDM3YTQ4YzhhNTU4NDExMmI4ZmFiZDM1ZGE4YTk4N2EiLCJhdWQiOiIzNzM4NjExNjY0MDQzMDM0IiwiZXhwIjoxNzcyNTI1NDQ3LCJqdGkiOiIzYjcyNTc3MC0wMWEyLTRiYmYtYTUxOS1kZTVhZmZjYjI4OWQiLCJpc3MiOiJ0cmFpbmluZy5haS5jbG91ZC5vdmgubmV0Iiwic3ViIjoidnMyMjc3MDMtb3ZoIiwib3ZoVG9rZW4iOiIzeGlxb3Z2RmNyaTMtTU1pd2dxa1U3TklDdXZtV0Y2dW5yWE5xeG9Ra0E2RE9lUDNiQ1dsX045T19MYnA0ZDdwN1pPa19GQTdZMk9iZjBxc2plZ2lxRXV3c1dTNWFLM25RMU5jaVJnNHNqdS1BYzMwQy1nLWFOcE4zaDdfZTk0a2tjSGxoaWFEeE1fUUp6WEVIY0dicHhZaHNXNURpa3NOczhOZkljYld4aE5HTVNhNmhQZXBPcnlOb05xNzhZUWFFQWhHMElNaC00Vm1lME52UUhXNWRGR3h6bGV2eWJ2NmlibHFIVGVRR2RmRHJ2NENiaFhUSEIyTkZKeXZ3c21IaG9lMFM3Z3VwSTQ5MV93am5IckpGSVlPQkpiVFU1WVJ6N19HMEtkNko1M0tfYWg0amRaREN3NGt3aXBuMkU3cy13V1NoektLcE1scG5vS2tZTzYwZHFDT3l2S2RjOU1HcUNRTl9OWUxUWFM5YWdxYXpMSzZGYzdrcWVYMWEwbEJDLWVvNGFEb085eG9wWkJwdzRiMFdtc2VCaXRNaTlqa1dBV2RZU2JzT1NjLTd4MFVTY1pxb1AyVUtabk9CTnY1cDVkM1RIVjNnM3RNMnU5enJRMzFzN1lmNmNPUXdlcTludjdDUDFUY0RqcXVrSUZCemthY3FmWFFmSEtGWE9Gajd1ZW1WV0RuSWFwNElhRks5bE10SEwwVV9McWowZHlXUFJtYjlZWm5LLWZVWWI1Unh0R3hGTlhyLVRHLWlkdUtnMnVaSU1QTy0zMUVfS2VnSmU5WG5OSUhqaG9SaGt2a182aFRHemlhVTg4STNkRzdabWhrZkh4Y2QtNHYwMWsxZmlfaWhTb1paUFRDeFVZTmtPRWlNR0QxTUliUlE3X2dPWl9wTC1DOWI3cDdueEo3S3RuUEdBZlZJS0hhREFXWmtoNlE4VmM2UFFqa0J5SEFLM3JLMHllcXgxNEdnZUxUT3RCZDIya0RXZ1NjeFc4QXlKdk1FSlFneW5tSjlmX1J4NzcwUTRwaENXU3hTanFpQXBFajNQZFNUZVM1WHU3bndLZFZsd3ZSakpocU95cl9HNEl2Z1NfUTBZTE5sejQ5ZXFaU2dXcVdOOUo2WDVqeG5EODdyOXZISGc3YkNuY2xSRUdqVS04dUtsUkZ2akliczNWU3NHNi1yTW5zU2VBR2l2TEM3SlJUNzNGNDQ1b05lcEo2cHdKY3lHWGJWSzFoVWxJZ3phT19VeFluVC1CMW05eXY4NmR6Ti1JeXlaYVkwSl9QWHlOTjJJdV94MHhvZHg1dFR4ZVU5WDVDM29NemZDQWRUaG1KYmh0bSJ9.uzey-28dSX6ZsWJcUFw7Y9Cal1LtlXT0ttrE0ScxHdPs5LOxQYXgs9AK1M-EUkgizraZXT2ToBRYInPiSB30Dg',
    'ADMIN_PASSWORD': 'synaigy!2024#',
    'CONTACT_NAME': 'Marc Achsnich',
    'CONTACT_TITLE': 'Head of Cloud',
    'CONTACT_PHOTO': 'https://profile-images.xing.com/images/0bac708fee0a79e6e7186a5fb08af312-26/marc-achsnich.1024x1024.jpg',
    'CONTACT_MEETING': 'https://meetings.hubspot.com/frank-hoerning/expertengesprach?uuid=e99278b4-1943-4661-ab4e-9d07a49536cf',
    'CONTACT_LINKEDIN': 'https://www.linkedin.com/in/achsnich/',
    'COMPANY_NAME': 'Synaigy GmbH'
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
            console.log(`Default configuration for ${key} initialized`);
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
