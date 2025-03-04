
#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the React application
echo "Building React application..."
npm run build

# The build is already in the dist directory with Vite, no need to create or copy
echo "Build complete. Files are in the dist directory."

# Start the server.js in the background
echo "Starting Node.js server..."
nohup node src/server.js > server.log 2>&1 &
echo $! > server.pid

echo "Deployment completed successfully!"
echo "React app is built in the dist directory"
echo "Node.js server is running in the background (PID: $(cat server.pid))"
echo "Server logs are available in server.log"

# Instructions for stopping the server
echo ""
echo "To stop the server, run: kill $(cat server.pid)"
