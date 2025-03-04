
# Database Configuration Guide

This document provides instructions on setting up and maintaining the SQLite database for the Synaigy Chatbot application.

## Database Structure

The application uses a SQLite database named `chatbot.db` located in the `src` directory. The database contains the following tables:

### 1. Counter Table

Stores the count of chat interactions.

```sql
CREATE TABLE counter (
  id INTEGER PRIMARY KEY,
  value INTEGER DEFAULT 0
);
```

### 2. Config Table

Stores all configuration values previously stored in env.ts.

```sql
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

## Initial Setup

The database is automatically initialized when the server starts with default values. However, if you need to manually create or reset the database, follow these steps:

1. Delete the existing `chatbot.db` file (if it exists)
2. Start the server by running `node src/server.js`
3. The database will be created automatically with the default configuration

## Manually Modifying Configuration

You can modify the configuration values in two ways:

### Using the API

The server provides REST endpoints to manage configuration:

- **Get all config values**: `GET /api/config`
- **Get a specific config value**: `GET /api/config/KEY_NAME`
- **Update a specific config value**: `POST /api/config/KEY_NAME` with body `{ "value": "new value" }`
- **Update multiple config values**: `POST /api/config` with a JSON object of key-value pairs

### Using SQL Directly

If you have access to the server, you can use the SQLite command-line interface to modify values:

```bash
# Access the database
sqlite3 src/chatbot.db

# View all configuration
SELECT * FROM config;

# Update a specific value
UPDATE config SET value = 'new_value' WHERE key = 'KEY_NAME';

# Insert a new configuration
INSERT INTO config (key, value) VALUES ('NEW_KEY', 'new_value');
```

## Configuration Keys

The following configuration keys are used by the application:

| Key | Description | Default Value |
|-----|-------------|---------------|
| API_ENDPOINT | The endpoint URL for the AI model API | https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1 |
| API_KEY | API key for accessing the AI model | [Long API Key] |
| ADMIN_PASSWORD | Password for accessing the admin area | synaigy!2024# |
| CONTACT_NAME | Name of the contact person displayed in footer | Marc Achsnich |
| CONTACT_TITLE | Job title of the contact person | Head of Cloud |
| CONTACT_PHOTO | URL to the contact person's photo | https://profile-images.xing.com/... |
| CONTACT_MEETING | URL for booking meetings with the contact | https://meetings.hubspot.com/... |
| CONTACT_LINKEDIN | URL to the contact's LinkedIn profile | https://www.linkedin.com/in/achsnich/ |
| COMPANY_NAME | Company name displayed in the footer | Synaigy GmbH |

## Backup and Restoration

To backup the database:

```bash
# Copy the database file
cp src/chatbot.db src/chatbot.db.backup
```

To restore from a backup:

```bash
# Make sure the server is stopped
cp src/chatbot.db.backup src/chatbot.db
```

## Troubleshooting

If you encounter issues with the database:

1. Check the server logs for any error messages
2. Verify database permissions (ensure the server has read/write access)
3. Try backing up and recreating the database
4. Ensure the database is not locked by another process
5. Use the SQLite CLI to check for database integrity: `sqlite3 src/chatbot.db "PRAGMA integrity_check;"`

For persistent issues, consider recreating the database with default values.
